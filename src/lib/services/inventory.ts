import { prisma } from "src/lib/prisma";
import { auditService } from "src/lib/audit";
import { requireRole, getAuthSession } from "src/lib/authz";
import {
  NotFoundError,
  ConflictError,
  ValidationError,
  AuthorizationError,
  BusinessRuleError,
  ok,
  fail,
  type Result,
} from "src/lib/errors";
import type { InventoryEntryType } from "@prisma/client";

export class InventoryService {
  async getByVariantId(variantId: string): Promise<Result<unknown>> {
    const inventory = await prisma.inventory.findUnique({
      where: { variantId },
      include: { variant: { select: { id: true, sku: true, productId: true } } },
    });
    if (!inventory) return fail(new NotFoundError("Inventory", variantId));
    return ok(inventory);
  }

  async list(productId: string): Promise<Result<unknown>> {
    const items = await prisma.inventory.findMany({
      where: { variant: { productId } },
      include: {
        variant: { select: { id: true, sku: true, price: true } },
      },
    });
    return ok(items);
  }

  async setThreshold(variantId: string, threshold: number): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager"]);

      const existing = await prisma.inventory.findUnique({ where: { variantId } });
      if (!existing) return fail(new NotFoundError("Inventory", variantId));

      if (threshold < 0) return fail(new ValidationError("Low stock threshold must be 0 or greater"));

      const inventory = await prisma.inventory.update({
        where: { variantId },
        data: { lowStockThreshold: threshold },
      });
      return ok(inventory);
    } catch (error: unknown) {
      if (error instanceof ValidationError || error instanceof AuthorizationError) return fail(error);
      throw error;
    }
  }

  async adjust(
    variantId: string,
    quantity: number,
    reason: string
  ): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager"]);

      const existing = await prisma.inventory.findUnique({ where: { variantId } });
      if (!existing) return fail(new NotFoundError("Inventory", variantId));
      if (!reason) return fail(new ValidationError("Reason is required for adjustment"));

      const result = await prisma.$transaction(async (tx) => {
        const updated = await tx.inventory.update({
          where: { variantId },
          data: { onHand: { increment: quantity } },
        });

        if (updated.onHand < 0) {
          throw new BusinessRuleError("Adjustment would result in negative on-hand stock");
        }

        await tx.inventoryLedger.create({
          data: {
            variantId,
            entryType: "adjustment",
            quantity,
            reason,
            actorId: session!.userId,
          },
        });

        return updated;
      });

      return ok(result);
    } catch (error: unknown) {
      if (
        error instanceof NotFoundError ||
        error instanceof ValidationError ||
        error instanceof BusinessRuleError ||
        error instanceof AuthorizationError
      ) {
        return fail(error);
      }
      throw error;
    }
  }

  async reserve(
    variantId: string,
    quantity: number,
    referenceId?: string,
    referenceType?: string
  ): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      if (!session) return fail(new AuthorizationError());

      const existing = await prisma.inventory.findUnique({ where: { variantId } });
      if (!existing) return fail(new NotFoundError("Inventory", variantId));
      if (quantity <= 0) return fail(new ValidationError("Reservation quantity must be positive"));

      const available = existing.onHand - existing.reserved;
      if (available < quantity) {
        return fail(new BusinessRuleError(`Insufficient stock. Available: ${available}, requested: ${quantity}`));
      }

      const result = await prisma.$transaction(async (tx) => {
        const updated = await tx.inventory.update({
          where: { variantId },
          data: { reserved: { increment: quantity } },
        });

        await tx.inventoryLedger.create({
          data: {
            variantId,
            entryType: "reservation",
            quantity,
            reason: "Reserved during checkout",
            referenceId,
            referenceType,
            actorId: session.userId,
          },
        });

        return updated;
      });

      return ok(result);
    } catch (error: unknown) {
      if (
        error instanceof NotFoundError ||
        error instanceof ValidationError ||
        error instanceof BusinessRuleError ||
        error instanceof AuthorizationError
      ) {
        return fail(error);
      }
      throw error;
    }
  }

  async commit(
    variantId: string,
    quantity: number,
    referenceId?: string,
    referenceType?: string
  ): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      if (!session) return fail(new AuthorizationError());

      const existing = await prisma.inventory.findUnique({ where: { variantId } });
      if (!existing) return fail(new NotFoundError("Inventory", variantId));
      if (quantity <= 0) return fail(new ValidationError("Commit quantity must be positive"));
      if (existing.reserved < quantity) {
        return fail(
          new BusinessRuleError(`Cannot commit ${quantity}: only ${existing.reserved} reserved`)
        );
      }

      const result = await prisma.$transaction(async (tx) => {
        const updated = await tx.inventory.update({
          where: { variantId },
          data: {
            onHand: { decrement: quantity },
            reserved: { decrement: quantity },
          },
        });

        await tx.inventoryLedger.create({
          data: {
            variantId,
            entryType: "commit",
            quantity: -quantity,
            reason: "Committed for order",
            referenceId,
            referenceType,
            actorId: session.userId,
          },
        });

        return updated;
      });

      return ok(result);
    } catch (error: unknown) {
      if (
        error instanceof NotFoundError ||
        error instanceof ValidationError ||
        error instanceof BusinessRuleError ||
        error instanceof AuthorizationError
      ) {
        return fail(error);
      }
      throw error;
    }
  }

  async release(
    variantId: string,
    quantity: number,
    reason: string = "Released from reservation",
    referenceId?: string,
    referenceType?: string
  ): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      if (!session) return fail(new AuthorizationError());

      const existing = await prisma.inventory.findUnique({ where: { variantId } });
      if (!existing) return fail(new NotFoundError("Inventory", variantId));
      if (quantity <= 0) return fail(new ValidationError("Release quantity must be positive"));
      if (existing.reserved < quantity) {
        return fail(
          new BusinessRuleError(`Cannot release ${quantity}: only ${existing.reserved} reserved`)
        );
      }

      const result = await prisma.$transaction(async (tx) => {
        const updated = await tx.inventory.update({
          where: { variantId },
          data: { reserved: { decrement: quantity } },
        });

        await tx.inventoryLedger.create({
          data: {
            variantId,
            entryType: "release",
            quantity: -quantity,
            reason,
            referenceId,
            referenceType,
            actorId: session.userId,
          },
        });

        return updated;
      });

      return ok(result);
    } catch (error: unknown) {
      if (
        error instanceof NotFoundError ||
        error instanceof ValidationError ||
        error instanceof BusinessRuleError ||
        error instanceof AuthorizationError
      ) {
        return fail(error);
      }
      throw error;
    }
  }

  async getLedger(
    variantId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<Result<unknown>> {
    const [entries, total] = await Promise.all([
      prisma.inventoryLedger.findMany({
        where: { variantId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: { actor: { select: { id: true, name: true } } },
      }),
      prisma.inventoryLedger.count({ where: { variantId } }),
    ]);

    return ok({ entries, total, page, totalPages: Math.ceil(total / limit) });
  }

  async getLowStock(productId?: string): Promise<Result<unknown>> {
    const where: Record<string, unknown> = {
      onHand: { lte: 0 },
    };
    if (productId) {
      where.variant = { productId };
    }

    const items = await prisma.inventory.findMany({
      where: where as any,
      include: {
        variant: {
          include: {
            product: { select: { id: true, name: true, slug: true } },
          },
        },
      },
      orderBy: { onHand: "asc" },
    });

    return ok(items);
  }
}

export const inventoryService = new InventoryService();

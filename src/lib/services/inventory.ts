import { Prisma } from "@prisma/client";
import { prisma } from "src/lib/prisma";
import { requireRole, getAuthSession } from "src/lib/authz";
import {
  NotFoundError,
  ValidationError,
  AuthorizationError,
  BusinessRuleError,
  asAppError,
  ok,
  fail,
  type Result,
} from "src/lib/errors";
import type { InventoryEntryType } from "@prisma/client";

export class InventoryService {
  async getByVariantId(variantId: string): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager", "support"]);
      const inventory = await prisma.inventory.findUnique({
        where: { variantId },
        include: {
          variant: { select: { id: true, sku: true, productId: true } },
        },
      });
      if (!inventory) return fail(new NotFoundError("Inventory", variantId));
      return ok(inventory);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async list(productId: string): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager", "support"]);
      const items = await prisma.inventory.findMany({
        where: { variant: { productId } },
        include: {
          variant: { select: { id: true, sku: true, price: true } },
        },
        orderBy: { variantId: "asc" },
        take: 500,
      });
      return ok(items);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async setThreshold(
    variantId: string,
    threshold: number,
  ): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager"]);

      const existing = await prisma.inventory.findUnique({
        where: { variantId },
      });
      if (!existing) return fail(new NotFoundError("Inventory", variantId));

      if (
        !Number.isSafeInteger(threshold) ||
        threshold < 0 ||
        threshold > 999_999_999
      )
        return fail(
          new ValidationError(
            "Low stock threshold must be a valid non-negative integer",
          ),
        );

      const inventory = await prisma.inventory.update({
        where: { variantId },
        data: { lowStockThreshold: threshold },
      });
      return ok(inventory);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async adjust(
    variantId: string,
    quantity: number,
    reason: string,
  ): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager"]);

      if (
        !Number.isSafeInteger(quantity) ||
        quantity === 0 ||
        Math.abs(quantity) > 1_000_000
      ) {
        return fail(
          new ValidationError(
            "Adjustment quantity must be a non-zero safe integer",
          ),
        );
      }
      const normalizedReason = reason.trim();
      if (normalizedReason.length < 3 || normalizedReason.length > 500) {
        return fail(
          new ValidationError(
            "Adjustment reason must be between 3 and 500 characters",
          ),
        );
      }

      const result = await prisma.$transaction(async (tx) => {
        const changed = await tx.$executeRaw`
          UPDATE "Inventory"
          SET "onHand" = "onHand" + ${quantity}, "updatedAt" = NOW()
          WHERE "variantId" = ${variantId}
            AND ("onHand" + ${quantity}) >= "reserved"
        `;
        if (changed !== 1)
          await this.throwStockFailure(
            tx,
            variantId,
            Math.abs(quantity),
            "sell",
          );

        await tx.inventoryLedger.create({
          data: {
            variantId,
            entryType: "adjustment",
            quantity,
            reason: normalizedReason,
            actorId: session!.userId,
          },
        });

        return tx.inventory.findUniqueOrThrow({ where: { variantId } });
      });

      return ok(result);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async reserve(
    variantId: string,
    quantity: number,
    referenceId?: string,
    referenceType?: string,
  ): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      if (!session) return fail(new AuthorizationError());

      if (quantity <= 0)
        return fail(
          new ValidationError("Reservation quantity must be positive"),
        );

      const result = await prisma.$transaction(async (tx) => {
        const changed = await tx.$executeRaw`
          UPDATE "Inventory"
          SET "reserved" = "reserved" + ${quantity}, "updatedAt" = NOW()
          WHERE "variantId" = ${variantId}
            AND ("onHand" - "reserved") >= ${quantity}
        `;
        if (changed !== 1)
          await this.throwStockFailure(tx, variantId, quantity, "reserve");

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

        return tx.inventory.findUniqueOrThrow({ where: { variantId } });
      });

      return ok(result);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async commit(
    variantId: string,
    quantity: number,
    referenceId?: string,
    referenceType?: string,
  ): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      if (!session) return fail(new AuthorizationError());

      if (quantity <= 0)
        return fail(new ValidationError("Commit quantity must be positive"));

      const result = await prisma.$transaction(async (tx) => {
        const changed = await tx.$executeRaw`
          UPDATE "Inventory"
          SET "onHand" = "onHand" - ${quantity},
              "reserved" = "reserved" - ${quantity},
              "updatedAt" = NOW()
          WHERE "variantId" = ${variantId}
            AND "reserved" >= ${quantity}
            AND "onHand" >= ${quantity}
        `;
        if (changed !== 1)
          await this.throwStockFailure(tx, variantId, quantity, "commit");

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

        return tx.inventory.findUniqueOrThrow({ where: { variantId } });
      });

      return ok(result);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async release(
    variantId: string,
    quantity: number,
    reason: string = "Released from reservation",
    referenceId?: string,
    referenceType?: string,
  ): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      if (!session) return fail(new AuthorizationError());

      if (quantity <= 0)
        return fail(new ValidationError("Release quantity must be positive"));

      const result = await prisma.$transaction(async (tx) => {
        const changed = await tx.$executeRaw`
          UPDATE "Inventory"
          SET "reserved" = "reserved" - ${quantity}, "updatedAt" = NOW()
          WHERE "variantId" = ${variantId}
            AND "reserved" >= ${quantity}
        `;
        if (changed !== 1)
          await this.throwStockFailure(tx, variantId, quantity, "release");

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

        return tx.inventory.findUniqueOrThrow({ where: { variantId } });
      });

      return ok(result);
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async getLedger(
    variantId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager", "support"]);
      const boundedPage =
        Number.isSafeInteger(page) && page > 0 ? Math.min(page, 10_000) : 1;
      const boundedLimit =
        Number.isSafeInteger(limit) && limit > 0 ? Math.min(limit, 100) : 50;
      const [entries, total] = await Promise.all([
        prisma.inventoryLedger.findMany({
          where: { variantId },
          orderBy: { createdAt: "desc" },
          skip: (boundedPage - 1) * boundedLimit,
          take: boundedLimit,
          include: { actor: { select: { id: true, name: true } } },
        }),
        prisma.inventoryLedger.count({ where: { variantId } }),
      ]);

      return ok({
        entries,
        total,
        page: boundedPage,
        totalPages: Math.ceil(total / boundedLimit),
      });
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async getLowStock(productId?: string): Promise<Result<unknown>> {
    const session = await getAuthSession();
    try {
      requireRole(session, ["admin", "catalog_manager", "support"]);
      const where: Record<string, unknown> = {};
      if (productId) {
        where.variant = { productId };
      }

      const allItems = await prisma.inventory.findMany({
        where: where as any,
        include: {
          variant: {
            include: {
              product: { select: { id: true, name: true, slug: true } },
            },
          },
        },
        orderBy: [{ onHand: "asc" }, { variantId: "asc" }],
        take: 1_000,
      });

      return ok(
        allItems.filter(
          (item) => item.onHand - item.reserved <= item.lowStockThreshold,
        ),
      );
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async commitAvailableInTransaction(
    tx: Prisma.TransactionClient,
    variantId: string,
    quantity: number,
    actorId: string,
    referenceId?: string,
    referenceType?: string,
  ) {
    if (quantity <= 0)
      throw new ValidationError("Commit quantity must be positive");
    const changed = await tx.$executeRaw`
      UPDATE "Inventory"
      SET "onHand" = "onHand" - ${quantity}, "updatedAt" = NOW()
      WHERE "variantId" = ${variantId}
        AND ("onHand" - "reserved") >= ${quantity}
    `;
    if (changed !== 1)
      await this.throwStockFailure(tx, variantId, quantity, "sell");
    await tx.inventoryLedger.create({
      data: {
        variantId,
        entryType: "commit",
        quantity: -quantity,
        reason: "Committed for order",
        referenceId,
        referenceType,
        actorId,
      },
    });
  }

  private async throwStockFailure(
    tx: Prisma.TransactionClient,
    variantId: string,
    quantity: number,
    operation: "reserve" | "commit" | "release" | "sell",
  ): Promise<never> {
    const inventory = await tx.inventory.findUnique({ where: { variantId } });
    if (!inventory) throw new NotFoundError("Inventory", variantId);
    const available = inventory.onHand - inventory.reserved;
    throw new BusinessRuleError(
      `${operation} failed for ${quantity} units; available=${available}, reserved=${inventory.reserved}`,
    );
  }
}

export const inventoryService = new InventoryService();

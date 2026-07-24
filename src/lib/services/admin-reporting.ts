import { Prisma } from "@prisma/client";
import { z } from "zod";

import { getAuthSession, requireRole } from "src/lib/authz";
import { asAppError, fail, ok, type Result } from "src/lib/errors";
import { prisma } from "src/lib/prisma";

export const MAX_REPORT_ROWS = 5_000;

const reportQuerySchema = z.object({
  type: z.enum(["orders", "payments", "cod", "inventory"]),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  currency: z.string().trim().length(3).default("USD"),
  timezone: z.string().trim().min(1).max(100).default("UTC"),
});

const auditQuerySchema = z.object({
  actorId: z.string().uuid().optional(),
  action: z.string().trim().max(120).optional(),
  targetType: z.string().trim().max(120).optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

function dates(from?: Date, to?: Date): Prisma.DateTimeFilter | undefined {
  if (!from && !to) return undefined;
  return {
    ...(from ? { gte: from } : {}),
    ...(to ? { lte: to } : {}),
  };
}

export class AdminReportingService {
  async report(input: {
    type?: unknown;
    from?: unknown;
    to?: unknown;
    currency?: unknown;
    timezone?: unknown;
  }): Promise<Result<unknown>> {
    try {
      const session = await getAuthSession();
      requireRole(session, ["admin"]);
      const parsed = reportQuerySchema.parse(input);
      const createdAt = dates(parsed.from, parsed.to);

      if (parsed.type === "inventory") {
        const rows = await prisma.inventory.findMany({
          include: {
            variant: {
              select: {
                sku: true,
                product: { select: { name: true } },
              },
            },
          },
          orderBy: [{ onHand: "asc" }, { variantId: "asc" }],
          take: MAX_REPORT_ROWS + 1,
        });
        const reportRows = rows.slice(0, MAX_REPORT_ROWS);
        return ok({
          generatedAt: new Date().toISOString(),
          timezone: parsed.timezone,
          currency: parsed.currency,
          type: parsed.type,
          truncated: rows.length > MAX_REPORT_ROWS,
          rows: reportRows.map((row) => ({
            product: row.variant.product.name,
            sku: row.variant.sku,
            onHand: row.onHand,
            reserved: row.reserved,
            available: row.onHand - row.reserved,
            lowStockThreshold: row.lowStockThreshold,
          })),
        });
      }

      if (parsed.type === "orders") {
        const rows = await prisma.order.findMany({
          where: {
            placedAt: { not: null },
            currency: parsed.currency.toUpperCase(),
            ...(createdAt ? { createdAt } : {}),
          },
          select: {
            orderNo: true,
            status: true,
            paymentStatus: true,
            fulfillmentStatus: true,
            paymentMethod: true,
            totalPrice: true,
            createdAt: true,
            user: { select: { email: true } },
          },
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          take: MAX_REPORT_ROWS + 1,
        });
        const reportRows = rows.slice(0, MAX_REPORT_ROWS);
        return ok({
          generatedAt: new Date().toISOString(),
          timezone: parsed.timezone,
          currency: parsed.currency.toUpperCase(),
          type: parsed.type,
          truncated: rows.length > MAX_REPORT_ROWS,
          rows: reportRows.map((row) => ({
            orderNo: row.orderNo,
            customer: row.user.email,
            orderStatus: row.status,
            paymentStatus: row.paymentStatus,
            fulfillmentStatus: row.fulfillmentStatus,
            paymentMethod: row.paymentMethod,
            total: row.totalPrice.toString(),
            createdAt: row.createdAt.toISOString(),
          })),
        });
      }

      const rows = await prisma.payment.findMany({
        where: {
          currency: parsed.currency.toUpperCase(),
          ...(createdAt ? { createdAt } : {}),
          ...(parsed.type === "cod" ? { provider: "CASH_ON_DELIVERY" } : {}),
        },
        select: {
          id: true,
          provider: true,
          status: true,
          amount: true,
          currency: true,
          attempts: true,
          createdAt: true,
          order: {
            select: { orderNo: true, paymentMethod: true },
          },
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: MAX_REPORT_ROWS + 1,
      });
      const reportRows = rows.slice(0, MAX_REPORT_ROWS);
      return ok({
        generatedAt: new Date().toISOString(),
        timezone: parsed.timezone,
        currency: parsed.currency.toUpperCase(),
        type: parsed.type,
        truncated: rows.length > MAX_REPORT_ROWS,
        rows: reportRows.map((row) => ({
          paymentId: row.id,
          orderNo: row.order.orderNo,
          provider: row.provider,
          paymentMethod: row.order.paymentMethod,
          status: row.status,
          amount: row.amount.toString(),
          attempts: row.attempts,
          createdAt: row.createdAt.toISOString(),
        })),
      });
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async audit(input: {
    actorId?: unknown;
    action?: unknown;
    targetType?: unknown;
    from?: unknown;
    to?: unknown;
    page?: unknown;
    limit?: unknown;
  }): Promise<Result<unknown>> {
    try {
      const session = await getAuthSession();
      requireRole(session, ["admin"]);
      const parsed = auditQuerySchema.parse(input);
      const where: Prisma.AuditLogWhereInput = {
        ...(parsed.actorId ? { actorId: parsed.actorId } : {}),
        ...(parsed.action
          ? { action: { contains: parsed.action, mode: "insensitive" } }
          : {}),
        ...(parsed.targetType ? { targetType: parsed.targetType } : {}),
        ...(dates(parsed.from, parsed.to)
          ? { createdAt: dates(parsed.from, parsed.to) }
          : {}),
      };
      const [entries, total] = await prisma.$transaction([
        prisma.auditLog.findMany({
          where,
          select: {
            id: true,
            action: true,
            targetType: true,
            targetId: true,
            metadata: true,
            ipAddress: true,
            createdAt: true,
            actor: { select: { id: true, name: true, email: true } },
          },
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          skip: (parsed.page - 1) * parsed.limit,
          take: parsed.limit,
        }),
        prisma.auditLog.count({ where }),
      ]);
      return ok({
        entries,
        pagination: {
          page: parsed.page,
          limit: parsed.limit,
          total,
          totalPages: Math.ceil(total / parsed.limit),
        },
      });
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }
}

export const adminReportingService = new AdminReportingService();

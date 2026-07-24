import { Prisma } from "@prisma/client";
import { z } from "zod";

import { getAuthSession, requireRole } from "src/lib/authz";
import {
  ValidationError,
  asAppError,
  fail,
  ok,
  type Result,
} from "src/lib/errors";
import { prisma } from "src/lib/prisma";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
] as const;

const dashboardQuerySchema = z.object({
  dateFrom: z.string().trim().min(1).max(100).optional(),
  dateTo: z.string().trim().min(1).max(100).optional(),
  currency: z
    .string()
    .trim()
    .regex(/^[A-Za-z]{3}$/)
    .transform((value) => value.toUpperCase())
    .default("USD"),
});

export type DashboardQueryInput = {
  dateFrom?: unknown;
  dateTo?: unknown;
  currency?: unknown;
};

function parseDateBoundary(
  value: string | undefined,
  endOfDay: boolean,
): Date | undefined {
  if (!value) return undefined;
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const parsed = new Date(
    dateOnly
      ? `${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}Z`
      : value,
  );
  if (Number.isNaN(parsed.getTime())) {
    throw new ValidationError(`Invalid ${endOfDay ? "dateTo" : "dateFrom"}`);
  }
  return parsed;
}

export class AdminDashboardService {
  async getMetrics(input: DashboardQueryInput): Promise<Result<unknown>> {
    try {
      const session = await getAuthSession();
      requireRole(session, ["admin"]);
      const parsed = dashboardQuerySchema.parse(input);
      const defaultTo = new Date();
      const defaultFrom = new Date(defaultTo);
      defaultFrom.setUTCDate(defaultFrom.getUTCDate() - 29);
      defaultFrom.setUTCHours(0, 0, 0, 0);
      const dateFrom = parseDateBoundary(parsed.dateFrom, false) ?? defaultFrom;
      const dateTo = parseDateBoundary(parsed.dateTo, true) ?? defaultTo;
      if (dateFrom > dateTo) {
        throw new ValidationError("dateFrom must not be after dateTo");
      }

      const retailOrderWhere: Prisma.OrderWhereInput = {
        placedAt: {
          not: null,
          gte: dateFrom,
          lte: dateTo,
        },
        currency: parsed.currency,
      };
      const paymentWhere: Prisma.PaymentWhereInput = {
        currency: parsed.currency,
        order: retailOrderWhere,
      };

      const [
        orderTotal,
        orderGroups,
        paidRevenue,
        partialRevenue,
        customerTotal,
        newCustomers,
        inventoryRows,
      ] = await Promise.all([
        prisma.order.count({ where: retailOrderWhere }),
        prisma.order.groupBy({
          by: ["status"],
          where: retailOrderWhere,
          _count: { _all: true },
        }),
        prisma.payment.aggregate({
          where: {
            ...paymentWhere,
            status: { in: ["PAID", "COLLECTED"] },
          },
          _sum: { amount: true },
        }),
        prisma.payment.aggregate({
          where: {
            ...paymentWhere,
            status: "PARTIALLY_REFUNDED",
          },
          _sum: { amount: true, refundedAmount: true },
        }),
        prisma.user.count({ where: { role: "user" } }),
        prisma.user.count({
          where: {
            role: "user",
            createdAt: { gte: dateFrom, lte: dateTo },
          },
        }),
        prisma.$queryRaw<
          Array<{ lowStockVariants: bigint; availableUnits: bigint }>
        >`
          SELECT
            COUNT(*)::bigint AS "lowStockVariants",
            COALESCE(SUM(i."onHand" - i."reserved"), 0)::bigint AS "availableUnits"
          FROM "Inventory" i
          INNER JOIN "ProductVariant" v ON v.id = i."variantId"
          INNER JOIN "Product" p ON p.id = v."productId"
          WHERE p.status = 'published'
            AND (i."onHand" - i."reserved") <= i."lowStockThreshold"
        `,
      ]);

      let netRevenue = new Prisma.Decimal(
        paidRevenue._sum.amount?.toString() ?? "0",
      );
      const partialGross = new Prisma.Decimal(
        partialRevenue._sum.amount?.toString() ?? "0",
      );
      const partialRefunded = new Prisma.Decimal(
        partialRevenue._sum.refundedAmount?.toString() ?? "0",
      );
      netRevenue = netRevenue.plus(
        Prisma.Decimal.max(partialGross.minus(partialRefunded), 0),
      );

      const orderStatus: Record<(typeof ORDER_STATUSES)[number], number> = {
        pending: 0,
        confirmed: 0,
        cancelled: 0,
        completed: 0,
      };
      for (const group of orderGroups) {
        orderStatus[group.status] = group._count._all;
      }
      const inventory = inventoryRows[0] ?? {
        lowStockVariants: BigInt(0),
        availableUnits: BigInt(0),
      };

      return ok({
        range: {
          dateFrom: dateFrom.toISOString(),
          dateTo: dateTo.toISOString(),
          currency: parsed.currency,
          revenueBasis: "order_placed_at",
        },
        orders: {
          total: orderTotal,
          byStatus: orderStatus,
        },
        revenue: {
          netCollected: netRevenue.toString(),
          currency: parsed.currency,
        },
        customers: {
          total: customerTotal,
          newInRange: newCustomers,
        },
        inventory: {
          lowStockVariants: Number(inventory.lowStockVariants),
          availableUnits: Number(inventory.availableUnits),
        },
        generatedAt: new Date().toISOString(),
      });
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }
}

export const adminDashboardService = new AdminDashboardService();

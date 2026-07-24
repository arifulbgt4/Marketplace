import { Prisma } from "@prisma/client";
import { z } from "zod";

import { getAuthSession, requireRole } from "src/lib/authz";
import {
  AuthenticationError,
  NotFoundError,
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
const PAYMENT_STATUSES = [
  "UNPAID",
  "PENDING",
  "PENDING_COLLECTION",
  "PAID",
  "COLLECTED",
  "FAILED",
  "CANCELLED",
  "PARTIALLY_REFUNDED",
  "REFUNDED",
] as const;
const FULFILLMENT_STATUSES = [
  "UNFULFILLED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "RETURNED",
] as const;

const pageSchema = z.coerce.number().int().min(1).max(10_000).default(1);
const limitSchema = z.coerce.number().int().min(1).max(100).default(20);

const adminOrderListSchema = z.object({
  search: z.string().trim().max(100).optional(),
  orderStatus: z.enum(ORDER_STATUSES).optional(),
  paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
  fulfillmentStatus: z.enum(FULFILLMENT_STATUSES).optional(),
  paymentMethod: z.string().trim().min(1).max(50).optional(),
  dateFrom: z.string().trim().min(1).optional(),
  dateTo: z.string().trim().min(1).optional(),
  page: pageSchema,
  limit: limitSchema,
});

const customerOrderListSchema = z.object({
  orderStatus: z.enum(ORDER_STATUSES).optional(),
  paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
  fulfillmentStatus: z.enum(FULFILLMENT_STATUSES).optional(),
  page: pageSchema,
  limit: limitSchema,
});

export type AdminOrderListInput = {
  search?: unknown;
  orderStatus?: unknown;
  paymentStatus?: unknown;
  fulfillmentStatus?: unknown;
  paymentMethod?: unknown;
  dateFrom?: unknown;
  dateTo?: unknown;
  page?: unknown;
  limit?: unknown;
};

export type CustomerOrderListInput = {
  orderStatus?: unknown;
  paymentStatus?: unknown;
  fulfillmentStatus?: unknown;
  page?: unknown;
  limit?: unknown;
};

const adminListSelect = {
  id: true,
  orderNo: true,
  status: true,
  statusVersion: true,
  paymentStatus: true,
  fulfillmentStatus: true,
  totalPrice: true,
  subtotal: true,
  shippingCost: true,
  discountAmount: true,
  currency: true,
  paymentMethod: true,
  placedAt: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  items: {
    select: {
      id: true,
      sku: true,
      productName: true,
      quantity: true,
    },
    orderBy: { id: "asc" as const },
    take: 3,
  },
  _count: {
    select: {
      items: true,
    },
  },
} satisfies Prisma.OrderSelect;

const customerListSelect = {
  id: true,
  orderNo: true,
  status: true,
  statusVersion: true,
  paymentStatus: true,
  fulfillmentStatus: true,
  totalPrice: true,
  subtotal: true,
  shippingCost: true,
  discountAmount: true,
  currency: true,
  paymentMethod: true,
  placedAt: true,
  createdAt: true,
  updatedAt: true,
  items: {
    select: {
      id: true,
      sku: true,
      productName: true,
      quantity: true,
    },
    orderBy: { id: "asc" as const },
    take: 3,
  },
  _count: {
    select: {
      items: true,
    },
  },
} satisfies Prisma.OrderSelect;

const orderDetailSelect = {
  id: true,
  orderNo: true,
  status: true,
  statusVersion: true,
  paymentStatus: true,
  fulfillmentStatus: true,
  totalPrice: true,
  subtotal: true,
  shippingCost: true,
  discountAmount: true,
  currency: true,
  paymentMethod: true,
  notes: true,
  shippingAddressSnapshot: true,
  placedAt: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  },
  coupon: {
    select: {
      id: true,
      code: true,
      description: true,
    },
  },
  deliveryMethod: {
    select: {
      id: true,
      name: true,
      code: true,
      carrier: true,
    },
  },
  items: {
    select: {
      id: true,
      variantId: true,
      productId: true,
      sku: true,
      productName: true,
      unitPrice: true,
      quantity: true,
      totalPrice: true,
      review: {
        select: {
          id: true,
          rating: true,
          comment: true,
          status: true,
          verifiedPurchase: true,
        },
      },
    },
    orderBy: { id: "asc" as const },
  },
  payments: {
    select: {
      id: true,
      amount: true,
      currency: true,
      status: true,
      provider: true,
      attempts: true,
      createdAt: true,
      updatedAt: true,
      events: {
        select: {
          id: true,
          type: true,
          statusFrom: true,
          statusTo: true,
          createdAt: true,
        },
        orderBy: [{ createdAt: "asc" as const }, { id: "asc" as const }],
      },
    },
    orderBy: [{ createdAt: "asc" as const }, { id: "asc" as const }],
  },
  statusHistory: {
    select: {
      id: true,
      sequence: true,
      kind: true,
      fromOrderStatus: true,
      toOrderStatus: true,
      fromFulfillmentStatus: true,
      toFulfillmentStatus: true,
      actorId: true,
      reason: true,
      createdAt: true,
      actor: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [{ sequence: "asc" as const }, { id: "asc" as const }],
  },
  shipments: {
    select: {
      id: true,
      status: true,
      carrier: true,
      service: true,
      trackingNumber: true,
      estimatedDeliveryAt: true,
      shippedAt: true,
      deliveredAt: true,
      createdAt: true,
      updatedAt: true,
      items: {
        select: {
          id: true,
          orderItemId: true,
          quantity: true,
        },
        orderBy: { id: "asc" as const },
      },
    },
    orderBy: [{ createdAt: "asc" as const }, { id: "asc" as const }],
  },
  returnRequests: {
    select: {
      id: true,
      requestedById: true,
      status: true,
      reason: true,
      resolutionNote: true,
      refundAmount: true,
      currency: true,
      approvedAt: true,
      receivedAt: true,
      completedAt: true,
      createdAt: true,
      updatedAt: true,
      items: {
        select: {
          id: true,
          orderItemId: true,
          quantity: true,
          reason: true,
          condition: true,
        },
        orderBy: { id: "asc" as const },
      },
    },
    orderBy: [{ createdAt: "asc" as const }, { id: "asc" as const }],
  },
} satisfies Prisma.OrderSelect;

const auditSelect = {
  id: true,
  action: true,
  targetType: true,
  targetId: true,
  createdAt: true,
  actor: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.AuditLogSelect;

type AdminListRecord = Prisma.OrderGetPayload<{
  select: typeof adminListSelect;
}>;
type CustomerListRecord = Prisma.OrderGetPayload<{
  select: typeof customerListSelect;
}>;
type OrderDetailRecord = Prisma.OrderGetPayload<{
  select: typeof orderDetailSelect;
}>;
type AuditRecord = Prisma.AuditLogGetPayload<{ select: typeof auditSelect }>;

function money(value: Prisma.Decimal | null): string | null {
  return value === null ? null : value.toString();
}

function timestamp(value: Date | null): string | null {
  return value?.toISOString() ?? null;
}

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

function baseListDto(record: AdminListRecord | CustomerListRecord) {
  return {
    id: record.id,
    orderNo: record.orderNo,
    orderStatus: record.status,
    statusVersion: record.statusVersion,
    paymentStatus: record.paymentStatus,
    fulfillmentStatus: record.fulfillmentStatus,
    totalPrice: money(record.totalPrice),
    subtotal: money(record.subtotal),
    shippingCost: money(record.shippingCost),
    discountAmount: money(record.discountAmount),
    currency: record.currency,
    paymentMethod: record.paymentMethod,
    placedAt: timestamp(record.placedAt),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    itemCount: record._count.items,
    itemPreview: record.items.map((item) => ({
      id: item.id,
      sku: item.sku,
      productName: item.productName,
      quantity: item.quantity,
    })),
  };
}

function detailDto(record: OrderDetailRecord, includeOperations: boolean) {
  return {
    id: record.id,
    orderNo: record.orderNo,
    orderStatus: record.status,
    statusVersion: record.statusVersion,
    paymentStatus: record.paymentStatus,
    fulfillmentStatus: record.fulfillmentStatus,
    totalPrice: money(record.totalPrice),
    subtotal: money(record.subtotal),
    shippingCost: money(record.shippingCost),
    discountAmount: money(record.discountAmount),
    currency: record.currency,
    paymentMethod: record.paymentMethod,
    notes: record.notes,
    shippingAddress: record.shippingAddressSnapshot,
    placedAt: timestamp(record.placedAt),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    customer: includeOperations ? record.user : undefined,
    coupon: record.coupon,
    deliveryMethod: record.deliveryMethod,
    items: record.items.map((item) => ({
      ...item,
      unitPrice: money(item.unitPrice),
      totalPrice: money(item.totalPrice),
    })),
    payments: record.payments.map((payment) => ({
      id: payment.id,
      amount: money(payment.amount),
      currency: payment.currency,
      status: payment.status,
      provider: includeOperations ? payment.provider : undefined,
      attempts: includeOperations ? payment.attempts : undefined,
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
      events: payment.events.map((event) => ({
        id: event.id,
        type: event.type,
        statusFrom: event.statusFrom,
        statusTo: event.statusTo,
        createdAt: event.createdAt.toISOString(),
      })),
    })),
    timeline: record.statusHistory.map((entry) => ({
      id: entry.id,
      sequence: entry.sequence,
      kind: entry.kind,
      fromOrderStatus: entry.fromOrderStatus,
      toOrderStatus: entry.toOrderStatus,
      fromFulfillmentStatus: entry.fromFulfillmentStatus,
      toFulfillmentStatus: entry.toFulfillmentStatus,
      actor: includeOperations ? entry.actor : undefined,
      reason: includeOperations ? entry.reason : undefined,
      createdAt: entry.createdAt.toISOString(),
    })),
    shipments: record.shipments.map((shipment) => ({
      ...shipment,
      estimatedDeliveryAt: timestamp(shipment.estimatedDeliveryAt),
      shippedAt: timestamp(shipment.shippedAt),
      deliveredAt: timestamp(shipment.deliveredAt),
      createdAt: shipment.createdAt.toISOString(),
      updatedAt: shipment.updatedAt.toISOString(),
    })),
    returns: record.returnRequests.map((returnRequest) => ({
      id: returnRequest.id,
      requestedById: includeOperations
        ? returnRequest.requestedById
        : undefined,
      status: returnRequest.status,
      reason: returnRequest.reason,
      resolutionNote: includeOperations
        ? returnRequest.resolutionNote
        : undefined,
      refundAmount: money(returnRequest.refundAmount),
      currency: returnRequest.currency,
      approvedAt: timestamp(returnRequest.approvedAt),
      receivedAt: timestamp(returnRequest.receivedAt),
      completedAt: timestamp(returnRequest.completedAt),
      createdAt: returnRequest.createdAt.toISOString(),
      updatedAt: returnRequest.updatedAt.toISOString(),
      items: returnRequest.items,
    })),
  };
}

export class OrderQueryService {
  async listAdminOrders(input: AdminOrderListInput): Promise<Result<unknown>> {
    try {
      const session = await getAuthSession();
      requireRole(session, ["admin", "support"]);
      const parsed = adminOrderListSchema.parse(input);
      const dateFrom = parseDateBoundary(parsed.dateFrom, false);
      const dateTo = parseDateBoundary(parsed.dateTo, true);
      if (dateFrom && dateTo && dateFrom > dateTo) {
        throw new ValidationError("dateFrom must not be after dateTo");
      }

      const where: Prisma.OrderWhereInput = {
        placedAt: {
          not: null,
          ...(dateFrom ? { gte: dateFrom } : {}),
          ...(dateTo ? { lte: dateTo } : {}),
        },
        ...(parsed.orderStatus ? { status: parsed.orderStatus } : {}),
        ...(parsed.paymentStatus
          ? { paymentStatus: parsed.paymentStatus }
          : {}),
        ...(parsed.fulfillmentStatus
          ? { fulfillmentStatus: parsed.fulfillmentStatus }
          : {}),
        ...(parsed.paymentMethod
          ? { paymentMethod: parsed.paymentMethod }
          : {}),
        ...(parsed.search
          ? {
              OR: [
                {
                  orderNo: {
                    contains: parsed.search,
                    mode: "insensitive" as const,
                  },
                },
                {
                  user: {
                    name: {
                      contains: parsed.search,
                      mode: "insensitive" as const,
                    },
                  },
                },
                {
                  user: {
                    email: {
                      contains: parsed.search,
                      mode: "insensitive" as const,
                    },
                  },
                },
              ],
            }
          : {}),
      };

      const [records, total] = await prisma.$transaction([
        prisma.order.findMany({
          where,
          select: adminListSelect,
          orderBy: [{ placedAt: "desc" }, { id: "desc" }],
          skip: (parsed.page - 1) * parsed.limit,
          take: parsed.limit,
        }),
        prisma.order.count({ where }),
      ]);

      return ok({
        orders: records.map((record) => ({
          ...baseListDto(record),
          customer: record.user,
        })),
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

  async getAdminOrder(id: string): Promise<Result<unknown>> {
    try {
      const session = await getAuthSession();
      requireRole(session, ["admin", "support"]);
      const order = await prisma.order.findFirst({
        where: { id, placedAt: { not: null } },
        select: orderDetailSelect,
      });
      if (!order) return fail(new NotFoundError("Order", id));

      const paymentIds = order.payments.map((payment) => payment.id);
      const audit = await prisma.auditLog.findMany({
        where: {
          OR: [
            { targetType: "order", targetId: order.id },
            ...(paymentIds.length
              ? [{ targetType: "payment", targetId: { in: paymentIds } }]
              : []),
          ],
        },
        select: auditSelect,
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      });

      return ok({
        ...detailDto(order, true),
        audit: audit.map((entry) => ({
          ...entry,
          createdAt: entry.createdAt.toISOString(),
        })),
      });
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async listCustomerOrders(
    input: CustomerOrderListInput = {},
  ): Promise<Result<unknown>> {
    try {
      const session = await getAuthSession();
      if (!session) return fail(new AuthenticationError());
      const parsed = customerOrderListSchema.parse(input);
      const where: Prisma.OrderWhereInput = {
        userId: session.userId,
        placedAt: { not: null },
        ...(parsed.orderStatus ? { status: parsed.orderStatus } : {}),
        ...(parsed.paymentStatus
          ? { paymentStatus: parsed.paymentStatus }
          : {}),
        ...(parsed.fulfillmentStatus
          ? { fulfillmentStatus: parsed.fulfillmentStatus }
          : {}),
      };

      const [records, total] = await prisma.$transaction([
        prisma.order.findMany({
          where,
          select: customerListSelect,
          orderBy: [{ placedAt: "desc" }, { id: "desc" }],
          skip: (parsed.page - 1) * parsed.limit,
          take: parsed.limit,
        }),
        prisma.order.count({ where }),
      ]);

      return ok({
        orders: records.map(baseListDto),
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

  async getCustomerOrder(id: string): Promise<Result<unknown>> {
    try {
      const session = await getAuthSession();
      if (!session) return fail(new AuthenticationError());
      const order = await prisma.order.findFirst({
        where: {
          id,
          userId: session.userId,
          placedAt: { not: null },
        },
        select: orderDetailSelect,
      });
      if (!order) return fail(new NotFoundError("Order", id));
      return ok(detailDto(order, false));
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }
}

export const orderQueryService = new OrderQueryService();

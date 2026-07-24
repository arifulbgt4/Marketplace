import { Prisma } from "@prisma/client";
import { z } from "zod";

import { getAuthSession, requireRole } from "src/lib/authz";
import {
  BusinessRuleError,
  NotFoundError,
  asAppError,
  fail,
  ok,
  type Result,
} from "src/lib/errors";
import { prisma } from "src/lib/prisma";

const CUSTOMER_STATUSES = [
  "active",
  "suspended",
  "pending_verification",
] as const;

const customerListSchema = z.object({
  search: z.string().trim().max(100).optional(),
  status: z.enum(CUSTOMER_STATUSES).optional(),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const customerStatusSchema = z
  .object({
    status: z.enum(CUSTOMER_STATUSES),
    reason: z.string().trim().min(3).max(500),
  })
  .strict();

export type CustomerAdminListInput = {
  search?: unknown;
  status?: unknown;
  page?: unknown;
  limit?: unknown;
};

const customerListSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  image: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      orders: {
        where: { placedAt: { not: null } },
      },
    },
  },
} satisfies Prisma.UserSelect;

const customerDetailSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  image: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  addresses: {
    select: {
      id: true,
      type: true,
      label: true,
      line1: true,
      line2: true,
      city: true,
      state: true,
      postalCode: true,
      country: true,
      phone: true,
      isDefault: true,
    },
    orderBy: [{ isDefault: "desc" as const }, { id: "asc" as const }],
  },
  orders: {
    where: { placedAt: { not: null } },
    select: {
      id: true,
      orderNo: true,
      status: true,
      paymentStatus: true,
      fulfillmentStatus: true,
      totalPrice: true,
      currency: true,
      placedAt: true,
    },
    orderBy: [{ placedAt: "desc" as const }, { id: "desc" as const }],
    take: 20,
  },
  _count: {
    select: {
      orders: {
        where: { placedAt: { not: null } },
      },
    },
  },
} satisfies Prisma.UserSelect;

type CustomerListRecord = Prisma.UserGetPayload<{
  select: typeof customerListSelect;
}>;
type CustomerDetailRecord = Prisma.UserGetPayload<{
  select: typeof customerDetailSelect;
}>;

function listDto(customer: CustomerListRecord) {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    image: customer.image,
    status: customer.status,
    orderCount: customer._count.orders,
    createdAt: customer.createdAt.toISOString(),
    updatedAt: customer.updatedAt.toISOString(),
  };
}

function detailDto(customer: CustomerDetailRecord) {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    image: customer.image,
    status: customer.status,
    orderCount: customer._count.orders,
    addresses: customer.addresses,
    recentOrders: customer.orders.map((order) => ({
      ...order,
      totalPrice: order.totalPrice.toString(),
      placedAt: order.placedAt?.toISOString() ?? null,
    })),
    createdAt: customer.createdAt.toISOString(),
    updatedAt: customer.updatedAt.toISOString(),
  };
}

export class CustomerAdminService {
  async list(input: CustomerAdminListInput): Promise<Result<unknown>> {
    try {
      const session = await getAuthSession();
      requireRole(session, ["admin", "support"]);
      const parsed = customerListSchema.parse(input);
      const where: Prisma.UserWhereInput = {
        role: "user",
        ...(parsed.status ? { status: parsed.status } : {}),
        ...(parsed.search
          ? {
              OR: [
                {
                  name: {
                    contains: parsed.search,
                    mode: "insensitive" as const,
                  },
                },
                {
                  email: {
                    contains: parsed.search,
                    mode: "insensitive" as const,
                  },
                },
                {
                  phone: {
                    contains: parsed.search,
                    mode: "insensitive" as const,
                  },
                },
              ],
            }
          : {}),
      };

      const [customers, total] = await prisma.$transaction([
        prisma.user.findMany({
          where,
          select: customerListSelect,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          skip: (parsed.page - 1) * parsed.limit,
          take: parsed.limit,
        }),
        prisma.user.count({ where }),
      ]);

      return ok({
        customers: customers.map(listDto),
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

  async getById(id: string): Promise<Result<unknown>> {
    try {
      const session = await getAuthSession();
      requireRole(session, ["admin", "support"]);
      const customer = await prisma.user.findFirst({
        where: { id, role: "user" },
        select: customerDetailSelect,
      });
      if (!customer) return fail(new NotFoundError("Customer", id));
      return ok(detailDto(customer));
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }

  async updateStatus(id: string, input: unknown): Promise<Result<unknown>> {
    try {
      const session = await getAuthSession();
      requireRole(session, ["admin"]);
      const parsed = customerStatusSchema.parse(input);
      if (session!.userId === id) {
        throw new BusinessRuleError(
          "Administrators cannot change their own account status here",
        );
      }

      const updated = await prisma.$transaction(async (tx) => {
        const customer = await tx.user.findFirst({
          where: { id, role: "user" },
          select: { id: true, status: true },
        });
        if (!customer) throw new NotFoundError("Customer", id);
        if (customer.status === parsed.status) {
          throw new BusinessRuleError(`Customer is already ${parsed.status}`);
        }

        const next = await tx.user.update({
          where: { id: customer.id },
          data: {
            status: parsed.status,
            sessionVersion: { increment: 1 },
          },
          select: customerListSelect,
        });
        await tx.auditLog.create({
          data: {
            actorId: session!.userId,
            action:
              parsed.status === "suspended" ? "user.suspend" : "user.activate",
            targetType: "user",
            targetId: customer.id,
            metadata: {
              statusFrom: customer.status,
              statusTo: parsed.status,
              reason: parsed.reason,
              sessionsInvalidated: true,
            },
          },
        });
        return next;
      });

      return ok(listDto(updated));
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }
}

export const customerAdminService = new CustomerAdminService();

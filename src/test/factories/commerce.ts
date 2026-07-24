import { createHash } from "node:crypto";

import { Prisma } from "@prisma/client";

const FIXED_TIME = new Date("2026-01-01T00:00:00.000Z");

function deterministicUuid(value: string) {
  const hex = createHash("sha256").update(value).digest("hex").slice(0, 32);
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    `4${hex.slice(13, 16)}`,
    `8${hex.slice(17, 20)}`,
    hex.slice(20),
  ].join("-");
}

export function createCommerceFixtureFactory(namespace: string) {
  const counters = new Map<string, number>();
  const next = (entity: string) => {
    const sequence = (counters.get(entity) ?? 0) + 1;
    counters.set(entity, sequence);
    return {
      sequence,
      id: deterministicUuid(`${namespace}:${entity}:${sequence}`),
      key: `${namespace}-${entity}-${sequence}`.toLowerCase(),
    };
  };

  return {
    user(
      overrides: Partial<Prisma.UserUncheckedCreateInput> = {},
    ): Prisma.UserUncheckedCreateInput {
      const fixture = next("user");
      return {
        id: fixture.id,
        name: `Test User ${fixture.sequence}`,
        email: `${fixture.key}@example.test`,
        password: "test-password-hash",
        role: "user",
        status: "active",
        sessionVersion: 0,
        createdAt: FIXED_TIME,
        updatedAt: FIXED_TIME,
        ...overrides,
      };
    },

    category(
      overrides: Partial<Prisma.CategoryUncheckedCreateInput> = {},
    ): Prisma.CategoryUncheckedCreateInput {
      const fixture = next("category");
      return {
        id: fixture.id,
        name: `Test Category ${fixture.sequence} ${namespace}`,
        slug: fixture.key,
        isActive: true,
        displayOrder: fixture.sequence,
        createdAt: FIXED_TIME,
        updatedAt: FIXED_TIME,
        ...overrides,
      };
    },

    product(
      createdById: string,
      categoryId: string | null = null,
      overrides: Partial<Prisma.ProductUncheckedCreateInput> = {},
    ): Prisma.ProductUncheckedCreateInput {
      const fixture = next("product");
      return {
        id: fixture.id,
        name: `Test Product ${fixture.sequence}`,
        slug: fixture.key,
        description: "Deterministic marketplace product fixture.",
        status: "published",
        categoryId,
        createdById,
        createdAt: FIXED_TIME,
        updatedAt: FIXED_TIME,
        ...overrides,
      };
    },

    cart(
      userId: string,
      overrides: Partial<Prisma.CartUncheckedCreateInput> = {},
    ): Prisma.CartUncheckedCreateInput {
      const fixture = next("cart");
      return {
        id: fixture.id,
        userId,
        currency: "USD",
        subtotal: new Prisma.Decimal(0),
        version: 1,
        expiresAt: new Date("2026-01-01T01:00:00.000Z"),
        createdAt: FIXED_TIME,
        updatedAt: FIXED_TIME,
        ...overrides,
      };
    },

    order(
      userId: string,
      overrides: Partial<Prisma.OrderUncheckedCreateInput> = {},
    ): Prisma.OrderUncheckedCreateInput {
      const fixture = next("order");
      return {
        id: fixture.id,
        orderNo: fixture.key.toUpperCase(),
        userId,
        totalPrice: new Prisma.Decimal("25.00"),
        subtotal: new Prisma.Decimal("20.00"),
        shippingCost: new Prisma.Decimal("5.00"),
        discountAmount: new Prisma.Decimal("0.00"),
        currency: "USD",
        status: "pending",
        statusVersion: 1,
        paymentStatus: "PENDING_COLLECTION",
        fulfillmentStatus: "UNFULFILLED",
        paymentMethod: "cod",
        placedAt: FIXED_TIME,
        createdAt: FIXED_TIME,
        updatedAt: FIXED_TIME,
        ...overrides,
      };
    },

    payment(
      orderId: string,
      overrides: Partial<Prisma.PaymentUncheckedCreateInput> = {},
    ): Prisma.PaymentUncheckedCreateInput {
      const fixture = next("payment");
      return {
        id: fixture.id,
        orderId,
        amount: new Prisma.Decimal("25.00"),
        currency: "USD",
        status: "PENDING_COLLECTION",
        provider: "CASH_ON_DELIVERY",
        providerRef: fixture.key,
        attempts: 1,
        createdAt: FIXED_TIME,
        updatedAt: FIXED_TIME,
        ...overrides,
      };
    },
  };
}

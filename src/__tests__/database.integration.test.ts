import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { Prisma, PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const authState = vi.hoisted(() => ({
  userId: "",
  role: "user" as "user" | "admin" | "support" | "catalog_manager",
}));
vi.mock("src/lib/authz", async (importOriginal) => {
  const actual = await importOriginal<typeof import("src/lib/authz")>();
  return {
    ...actual,
    getAuthSession: async () =>
      authState.userId
        ? {
            userId: authState.userId,
            sessionId: "integration",
            role: authState.role,
            accountStatus: "active" as const,
            permissions: [],
            isSystem: false,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 60_000),
          }
        : null,
  };
});

import { inventoryService } from "src/lib/services/inventory";
import { checkoutCoordinator } from "src/lib/services/checkout";
import { accountService } from "src/lib/services/account";
import { orderCancellationService } from "src/lib/services/order-cancellation";
import { orderReturnService } from "src/lib/services/order-return";
import { compare } from "bcryptjs";

const run = process.env.RUN_DB_TESTS === "true";
const db = new PrismaClient();
const ids = {
  user: randomUUID(),
  category: randomUUID(),
  product: randomUUID(),
  variant: randomUUID(),
  cart: randomUUID(),
  address: randomUUID(),
  zone: randomUUID(),
  method: randomUUID(),
  checkout: randomUUID(),
};

describe.skipIf(!run)("database transaction boundaries", () => {
  beforeAll(async () => {
    authState.userId = ids.user;
    authState.role = "user";
    await db.user.create({
      data: {
        id: ids.user,
        name: "Integration User",
        email: `integration-${ids.user}@example.com`,
        password: "not-used",
        status: "active",
      },
    });
    await db.category.create({
      data: {
        id: ids.category,
        name: `Integration ${ids.category}`,
        slug: `integration-${ids.category}`,
      },
    });
    await db.product.create({
      data: {
        id: ids.product,
        name: "Integration Product",
        slug: `integration-product-${ids.product}`,
        description:
          "Integration product used to verify transaction boundaries.",
        status: "published",
        categoryId: ids.category,
        createdById: ids.user,
        media: {
          create: {
            url: "https://example.com/integration.png",
            isPrimary: true,
          },
        },
        variants: {
          create: {
            id: ids.variant,
            sku: `INT-${ids.variant}`,
            price: new Prisma.Decimal(10),
            inventory: { create: { onHand: 5, reserved: 0 } },
          },
        },
      },
    });
  });

  afterAll(async () => {
    await db.product.deleteMany({ where: { id: ids.product } });
    await db.deliveryZone.deleteMany({ where: { id: ids.zone } });
    await db.user.deleteMany({ where: { id: ids.user } });
    await db.category.deleteMany({ where: { id: ids.category } });
    await db.$disconnect();
  });

  it("does not oversell under concurrent stock commits", async () => {
    const attempts = await Promise.allSettled(
      Array.from({ length: 10 }, (_, index) =>
        db.$transaction((tx) =>
          inventoryService.commitAvailableInTransaction(
            tx,
            ids.variant,
            1,
            ids.user,
            `concurrency-${index}`,
            "test",
          ),
        ),
      ),
    );
    expect(
      attempts.filter((attempt) => attempt.status === "fulfilled"),
    ).toHaveLength(5);
    const inventory = await db.inventory.findUniqueOrThrow({
      where: { variantId: ids.variant },
    });
    expect(inventory.onHand).toBe(0);
    expect(inventory.reserved).toBe(0);
  });

  it("returns one order for duplicate placement keys and commits stock once", async () => {
    await db.inventory.update({
      where: { variantId: ids.variant },
      data: { onHand: 10, reserved: 0 },
    });
    await db.cart.create({
      data: {
        id: ids.cart,
        userId: ids.user,
        subtotal: new Prisma.Decimal(20),
        version: 1,
        expiresAt: new Date(Date.now() + 60_000),
        items: {
          create: {
            variantId: ids.variant,
            productId: ids.product,
            sku: `INT-${ids.variant}`,
            productName: "Integration Product",
            unitPrice: new Prisma.Decimal(10),
            quantity: 2,
          },
        },
      },
    });
    await db.address.create({
      data: {
        id: ids.address,
        userId: ids.user,
        type: "shipping",
        label: "Test",
        line1: "1 Test Road",
        city: "Dhaka",
        state: "Dhaka",
        postalCode: "1200",
        country: "BD",
      },
    });
    await db.deliveryZone.create({
      data: {
        id: ids.zone,
        name: "Bangladesh",
        slug: `bd-${ids.zone}`,
        countries: ["BD"],
        methods: {
          create: {
            id: ids.method,
            name: "Standard",
            code: "standard",
            price: new Prisma.Decimal(5),
          },
        },
      },
    });
    await db.checkoutSession.create({
      data: {
        id: ids.checkout,
        cartId: ids.cart,
        cartVersion: 1,
        userId: ids.user,
        subtotal: new Prisma.Decimal(20),
        shippingCost: new Prisma.Decimal(5),
        discountAmount: new Prisma.Decimal(0),
        totalAmount: new Prisma.Decimal(25),
        shippingAddressId: ids.address,
        deliveryMethodId: ids.method,
        expiresAt: new Date(Date.now() + 60_000),
      },
    });

    const idempotencyKey = randomUUID();
    const payload = {
      checkoutSessionId: ids.checkout,
      idempotencyKey,
      paymentMethod: "cod" as const,
    };
    const [first, second] = await Promise.all([
      checkoutCoordinator.placeOrder(payload),
      checkoutCoordinator.placeOrder(payload),
    ]);
    expect(first.success).toBe(true);
    expect(second.success).toBe(true);
    if (first.success && second.success)
      expect(second.data).toEqual(first.data);
    expect(await db.order.count({ where: { idempotencyKey } })).toBe(1);
    const inventory = await db.inventory.findUniqueOrThrow({
      where: { variantId: ids.variant },
    });
    expect(inventory.onHand).toBe(8);
    expect(
      await db.inventoryLedger.count({
        where: { referenceType: "order", variantId: ids.variant },
      }),
    ).toBe(1);
  });

  it("cancels once and compensates committed stock idempotently", async () => {
    authState.role = "user";
    const order = await db.order.findFirstOrThrow({
      where: { idempotencyKey: { not: null }, userId: ids.user },
      select: { id: true, statusVersion: true },
    });
    const first = await orderCancellationService.cancel(order.id, {
      reason: "Integration cancellation",
      expectedVersion: order.statusVersion,
    });
    expect(first.success).toBe(true);
    const second = await orderCancellationService.cancel(order.id, {
      reason: "Integration cancellation retry",
      expectedVersion: order.statusVersion + 1,
    });
    expect(second.success).toBe(false);

    const inventory = await db.inventory.findUniqueOrThrow({
      where: { variantId: ids.variant },
    });
    expect(inventory.onHand).toBe(10);
    expect(
      await db.resourceRelease.count({
        where: { orderId: order.id, type: "INVENTORY" },
      }),
    ).toBe(1);
    expect(
      await db.payment.count({
        where: { orderId: order.id, status: "CANCELLED" },
      }),
    ).toBe(1);
  });

  it("coordinates a delivered return, restock and refund request", async () => {
    authState.role = "user";
    await db.inventory.update({
      where: { variantId: ids.variant },
      data: { onHand: { decrement: 1 } },
    });
    const order = await db.order.create({
      data: {
        orderNo: `RET-${randomUUID()}`,
        status: "confirmed",
        statusVersion: 1,
        fulfillmentStatus: "DELIVERED",
        paymentStatus: "COLLECTED",
        paymentMethod: "cod",
        totalPrice: new Prisma.Decimal(10),
        subtotal: new Prisma.Decimal(10),
        currency: "USD",
        userId: ids.user,
        placedAt: new Date(),
        items: {
          create: {
            variantId: ids.variant,
            productId: ids.product,
            sku: `INT-${ids.variant}`,
            productName: "Integration Product",
            unitPrice: new Prisma.Decimal(10),
            totalPrice: new Prisma.Decimal(10),
            quantity: 1,
          },
        },
        payments: {
          create: {
            amount: new Prisma.Decimal(10),
            currency: "USD",
            status: "COLLECTED",
            provider: "CASH_ON_DELIVERY",
          },
        },
      },
      include: { items: true },
    });

    const requested = await orderReturnService.request(order.id, {
      reason: "Integration return",
      items: [{ orderItemId: order.items[0].id, quantity: 1 }],
    });
    expect(requested.success).toBe(true);
    if (!requested.success) throw requested.error;
    const returnId = (requested.data as { id: string }).id;

    authState.role = "admin";
    for (const status of ["APPROVED", "RECEIVED", "COMPLETED"] as const) {
      const decision = await orderReturnService.decide(returnId, {
        status,
        resolutionNote: `Integration ${status.toLowerCase()}`,
      });
      expect(decision.success).toBe(true);
    }
    authState.role = "user";

    expect(
      (
        await db.inventory.findUniqueOrThrow({
          where: { variantId: ids.variant },
        })
      ).onHand,
    ).toBe(10);
    expect(
      await db.outboxEvent.count({
        where: {
          aggregateId: order.id,
          eventType: "payment.refund_requested",
        },
      }),
    ).toBe(1);
    const completed = await db.order.findUniqueOrThrow({
      where: { id: order.id },
      select: { fulfillmentStatus: true },
    });
    expect(completed.fulfillmentStatus).toBe("RETURNED");
  });

  it("enforces identity and single-default/primary constraints in PostgreSQL", async () => {
    await expect(db.cart.create({ data: { currency: "USD" } })).rejects.toThrow(
      /Cart_identity_check/,
    );

    await db.address.create({
      data: {
        userId: ids.user,
        type: "billing",
        label: "Default billing",
        line1: "1 Test Road",
        city: "Dhaka",
        state: "Dhaka",
        postalCode: "1200",
        country: "BD",
        isDefault: true,
      },
    });
    await expect(
      db.address.create({
        data: {
          userId: ids.user,
          type: "billing",
          label: "Duplicate default",
          line1: "2 Test Road",
          city: "Dhaka",
          state: "Dhaka",
          postalCode: "1200",
          country: "BD",
          isDefault: true,
        },
      }),
    ).rejects.toMatchObject({ code: "P2002" });

    await expect(
      db.productMedia.create({
        data: {
          productId: ids.product,
          url: "https://example.com/second-primary.png",
          isPrimary: true,
        },
      }),
    ).rejects.toMatchObject({ code: "P2002" });

    await expect(
      db.productVariant.update({
        where: { id: ids.variant },
        data: { weightGrams: -1 },
      }),
    ).rejects.toThrow(/ProductVariant_weight_check/);

    await expect(
      db.deliveryMethod.update({
        where: { id: ids.method },
        data: { minWeightGrams: 5000, maxWeightGrams: 1000 },
      }),
    ).rejects.toThrow(/DeliveryMethod_weight_check/);
  });

  it("consumes account tokens once and invalidates existing sessions", async () => {
    const before = await db.user.findUniqueOrThrow({
      where: { id: ids.user },
      select: { email: true, sessionVersion: true },
    });
    const resetToken = await accountService.generatePasswordResetToken(
      before.email,
    );
    await accountService.resetPassword(resetToken, "new-password-123");
    await expect(
      accountService.resetPassword(resetToken, "another-password-123"),
    ).rejects.toThrow(/already been used/);
    const after = await db.user.findUniqueOrThrow({
      where: { id: ids.user },
      select: { password: true, sessionVersion: true },
    });
    expect(after.sessionVersion).toBe(before.sessionVersion + 1);
    expect(await compare("new-password-123", after.password)).toBe(true);

    const verificationToken =
      await accountService.generateEmailVerificationToken(ids.user);
    await accountService.verifyEmail(verificationToken);
    await expect(accountService.verifyEmail(verificationToken)).rejects.toThrow(
      /already been used/,
    );
  });
});

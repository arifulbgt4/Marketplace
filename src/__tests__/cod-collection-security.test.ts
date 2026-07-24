import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ErrorCode } from "src/lib/errors";

const routeMocks = vi.hoisted(() => ({
  getAuthSession: vi.fn(),
  requireRole: vi.fn(),
  collectPayment: vi.fn(),
}));

vi.mock("src/lib/authz", async (importOriginal) => {
  const actual = await importOriginal<typeof import("src/lib/authz")>();
  return {
    ...actual,
    getAuthSession: routeMocks.getAuthSession,
    requireRole: routeMocks.requireRole,
  };
});

vi.mock("src/lib/services/cod-collection", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("src/lib/services/cod-collection")>();
  return {
    ...actual,
    codCollectionService: { collectPayment: routeMocks.collectPayment },
  };
});

import { POST as collectCodRoute } from "src/app/api/admin/orders/[id]/collect/route";
import { CODCollectionService } from "src/lib/services/cod-collection";

function codPayment() {
  return {
    id: "payment-1",
    orderId: "order-1",
    amount: new Prisma.Decimal("125.50"),
    currency: "USD",
    status: "PENDING_COLLECTION",
    order: { id: "order-1", orderNo: "ORD-1001" },
  };
}

function createDb() {
  const db = {
    user: { findUnique: vi.fn().mockResolvedValue({ role: "admin" }) },
    paymentEvent: {
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: "event-1" }),
    },
    payment: {
      findFirst: vi.fn().mockResolvedValue(codPayment()),
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
    },
    order: {
      update: vi.fn().mockResolvedValue({
        id: "order-1",
        orderNo: "ORD-1001",
      }),
    },
    auditLog: { create: vi.fn().mockResolvedValue({ id: "audit-1" }) },
    $transaction: vi.fn(),
  };
  db.$transaction.mockImplementation(
    async (operation: (tx: typeof db) => Promise<unknown>) => operation(db),
  );
  return db;
}

describe("COD collection security", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    routeMocks.getAuthSession.mockResolvedValue({
      userId: "admin-1",
      role: "admin",
    });
  });

  it("requires a valid idempotency key before collection", async () => {
    const response = await collectCodRoute(
      new NextRequest("http://localhost/api/admin/orders/order-1/collect", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ collectedAmount: 125.5, currency: "USD" }),
      }),
      { params: Promise.resolve({ id: "order-1" }) },
    );

    expect(response.status).toBe(400);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(routeMocks.collectPayment).not.toHaveBeenCalled();
  });

  it("does not expose unexpected internal errors from the route", async () => {
    routeMocks.collectPayment.mockRejectedValue(
      new Error("DATABASE_URL=private-secret"),
    );

    const response = await collectCodRoute(
      new NextRequest("http://localhost/api/admin/orders/order-1/collect", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "idempotency-key": "cod:order-1:attempt-1",
        },
        body: JSON.stringify({ collectedAmount: 125.5, currency: "usd" }),
      }),
      { params: Promise.resolve({ id: "order-1" }) },
    );
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toMatchObject({
      code: ErrorCode.INTERNAL_ERROR,
      message: "An unexpected error occurred",
    });
    expect(JSON.stringify(body)).not.toContain("private-secret");
  });

  it("records a currency-matched collection with a guarded state update", async () => {
    const db = createDb();
    const service = new CODCollectionService(db as never);

    const result = await service.collectPayment("admin-1", {
      orderId: "order-1",
      collectedAmount: 125.5,
      currency: "usd",
      idempotencyKey: "cod:order-1:attempt-1",
      receiptRef: "receipt-1",
    });

    expect(result.success).toBe(true);
    expect(db.payment.updateMany).toHaveBeenCalledWith({
      where: { id: "payment-1", status: "PENDING_COLLECTION" },
      data: { status: "COLLECTED" },
    });
    expect(db.paymentEvent.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        idempotencyKey: "cod:order-1:attempt-1",
        type: "MANUAL_COLLECTION",
        metadata: expect.objectContaining({
          currency: "USD",
          collectedAmount: "125.50",
        }),
      }),
    });
  });

  it("blocks a collection currency mismatch before changing state", async () => {
    const db = createDb();
    const service = new CODCollectionService(db as never);

    const result = await service.collectPayment("admin-1", {
      orderId: "order-1",
      collectedAmount: 125.5,
      currency: "BDT",
      idempotencyKey: "cod:order-1:attempt-1",
    });

    expect(result).toMatchObject({
      success: false,
      error: { code: ErrorCode.BUSINESS_RULE },
    });
    expect(db.payment.updateMany).not.toHaveBeenCalled();
  });

  it("requires an admin and documented reason for amount anomalies", async () => {
    const supportDb = createDb();
    supportDb.user.findUnique.mockResolvedValue({ role: "support" });
    const supportService = new CODCollectionService(supportDb as never);
    const supportResult = await supportService.collectPayment("support-1", {
      orderId: "order-1",
      collectedAmount: 120,
      currency: "USD",
      idempotencyKey: "cod:order-1:support-1",
      notes: "Customer paid less",
    });

    const adminDb = createDb();
    const adminService = new CODCollectionService(adminDb as never);
    const undocumentedResult = await adminService.collectPayment("admin-1", {
      orderId: "order-1",
      collectedAmount: 120,
      currency: "USD",
      idempotencyKey: "cod:order-1:admin-1",
    });

    const documentedDb = createDb();
    const documentedService = new CODCollectionService(documentedDb as never);
    const documentedResult = await documentedService.collectPayment("admin-1", {
      orderId: "order-1",
      collectedAmount: 120,
      currency: "USD",
      idempotencyKey: "cod:order-1:admin-2",
      notes: "Customer paid an approved adjusted amount",
    });

    expect(supportResult).toMatchObject({
      success: false,
      error: { code: ErrorCode.BUSINESS_RULE },
    });
    expect(undocumentedResult).toMatchObject({
      success: false,
      error: { code: ErrorCode.BUSINESS_RULE },
    });
    expect(documentedResult).toMatchObject({
      success: true,
      data: { collectedAmount: 120, isAnomaly: true },
    });
    expect(supportDb.payment.updateMany).not.toHaveBeenCalled();
    expect(adminDb.payment.updateMany).not.toHaveBeenCalled();
    expect(documentedDb.payment.updateMany).toHaveBeenCalledTimes(1);
  });

  it("returns a no-op replay for a completed matching idempotency key", async () => {
    const db = createDb();
    db.paymentEvent.findUnique.mockResolvedValue({
      id: "event-1",
      type: "MANUAL_COLLECTION",
      paymentId: "payment-1",
      statusTo: "COLLECTED",
      metadata: {
        expectedAmount: "125.50",
        collectedAmount: "125.50",
        isAnomaly: false,
      },
      payment: {
        amount: new Prisma.Decimal("125.50"),
        order: { id: "order-1", orderNo: "ORD-1001" },
      },
    });
    const service = new CODCollectionService(db as never);

    const result = await service.collectPayment("admin-1", {
      orderId: "order-1",
      collectedAmount: 125.5,
      currency: "USD",
      idempotencyKey: "cod:order-1:attempt-1",
    });

    expect(result).toMatchObject({
      success: true,
      data: { paymentId: "payment-1", noop: true },
    });
    expect(db.payment.findFirst).not.toHaveBeenCalled();
    expect(db.payment.updateMany).not.toHaveBeenCalled();
  });

  it("returns safe service errors for unexpected persistence failures", async () => {
    const db = createDb();
    db.user.findUnique.mockRejectedValue(
      new Error("postgres://private-credential"),
    );
    const service = new CODCollectionService(db as never);

    const result = await service.collectPayment("admin-1", {
      orderId: "order-1",
      collectedAmount: 125.5,
      currency: "USD",
      idempotencyKey: "cod:order-1:attempt-1",
    });

    expect(result).toMatchObject({
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: "An unexpected error occurred",
      },
    });
    expect(JSON.stringify(result)).not.toContain("private-credential");
  });
});

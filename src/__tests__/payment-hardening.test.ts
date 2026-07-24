import { PaymentStatus, Prisma, type PrismaClient } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const dependencies = vi.hoisted(() => ({
  transition: vi.fn(),
  compensate: vi.fn(),
  enqueue: vi.fn(),
}));

vi.mock("src/lib/services/order-transition", () => ({
  orderTransitionService: {
    transitionOrderInTransaction: dependencies.transition,
  },
}));
vi.mock("src/lib/services/order-compensation", () => ({
  orderCompensationService: {
    compensateOrderResourcesInTransaction: dependencies.compensate,
  },
}));
vi.mock("src/lib/services/outbox", () => ({
  enqueueOutboxEvent: dependencies.enqueue,
}));

import {
  MockPaymentAdapter,
  PaymentRegistry,
  signMockWebhook,
  type PaymentAdapter as PaymentAdapterContract,
} from "src/lib/services/payment-adapter";
import {
  PAYMENT_ALLOWED_TRANSITIONS,
  evaluatePaymentTransition,
} from "src/lib/services/payment-lifecycle";
import { PaymentReconciliationService } from "src/lib/services/payment-reconciliation";
import { PaymentRefundService } from "src/lib/services/payment-refund";

const ORDER_ID = "11111111-1111-4111-8111-111111111111";
const PAYMENT_ID = "22222222-2222-4222-8222-222222222222";
const ACTOR_ID = "33333333-3333-4333-8333-333333333333";

function paymentRecord(status: PaymentStatus) {
  return {
    id: PAYMENT_ID,
    orderId: ORDER_ID,
    amount: new Prisma.Decimal("10.00"),
    refundedAmount: new Prisma.Decimal("0.00"),
    currency: "USD",
    status,
    provider: "MOCK",
    providerRef: "mock-payment-1",
    attempts: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    order: {
      id: ORDER_ID,
      orderNo: "ORD-100",
      userId: ACTOR_ID,
      status: "pending",
      statusVersion: 0,
      paymentStatus: PaymentStatus.PENDING,
    },
  };
}

describe("payment lifecycle policy", () => {
  const statuses = Object.values(PaymentStatus);

  it.each(
    statuses.flatMap((from) =>
      statuses.map((to) => ({
        from,
        to,
        expected:
          from === to && from !== PaymentStatus.PARTIALLY_REFUNDED
            ? "duplicate"
            : (
                  PAYMENT_ALLOWED_TRANSITIONS[from] as readonly PaymentStatus[]
                ).includes(to)
              ? "apply"
              : "ignore",
      })),
    ),
  )("$from -> $to is $expected", ({ from, to, expected }) => {
    expect(evaluatePaymentTransition(from, to).kind).toBe(expected);
  });

  it("classifies pending after paid as an out-of-order event", () => {
    expect(
      evaluatePaymentTransition(PaymentStatus.PAID, PaymentStatus.PENDING),
    ).toMatchObject({ kind: "ignore", reason: "OUT_OF_ORDER" });
  });
});

describe("signed MOCK webhook", () => {
  const secret = "test-webhook-secret-with-32-characters";
  const payload = JSON.stringify({
    eventId: "evt-100",
    event: "payment.status.changed",
    providerRef: "mock-payment-1",
    amount: 10,
    status: "PAID",
  });

  it("accepts an exact raw-body HMAC signature", async () => {
    const adapter = new MockPaymentAdapter(() => secret);
    const result = await adapter.handleWebhook(payload, {
      "x-mock-signature": signMockWebhook(payload, secret),
    });

    expect(result).toMatchObject({
      success: true,
      data: {
        eventId: "evt-100",
        providerRef: "mock-payment-1",
        status: "PAID",
      },
    });
  });

  it("rejects an invalid signature without exposing configuration", async () => {
    const adapter = new MockPaymentAdapter(() => secret);
    const result = await adapter.handleWebhook(payload, {
      "x-mock-signature": "sha256=invalid",
    });

    expect(result).toMatchObject({
      success: false,
      error: { code: "AUTHENTICATION_ERROR", statusCode: 401 },
    });
    if (!result.success) expect(result.error.message).not.toContain(secret);
  });

  it("fails safely when the signing secret is absent", async () => {
    const result = await new MockPaymentAdapter(() => undefined).handleWebhook(
      payload,
      {},
    );

    expect(result).toMatchObject({
      success: false,
      error: { code: "INTERNAL_ERROR", statusCode: 503 },
    });
  });
});

describe("PaymentReconciliationService", () => {
  const tx = {
    paymentEvent: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    payment: {
      findUnique: vi.fn(),
      findUniqueOrThrow: vi.fn(),
      updateMany: vi.fn(),
    },
    order: { update: vi.fn() },
    auditLog: { create: vi.fn() },
  };
  const db = {
    $transaction: vi.fn(
      async (operation: (client: typeof tx) => Promise<unknown>) =>
        operation(tx),
    ),
    paymentEvent: { findUnique: vi.fn() },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    db.$transaction.mockImplementation(
      async (operation: (client: typeof tx) => Promise<unknown>) =>
        operation(tx),
    );
    tx.paymentEvent.findUnique.mockResolvedValue(null);
    tx.paymentEvent.create.mockResolvedValue({ id: "payment-event-1" });
    tx.payment.updateMany.mockResolvedValue({ count: 1 });
    tx.order.update.mockResolvedValue({
      id: ORDER_ID,
      orderNo: "ORD-100",
      status: "confirmed",
      paymentStatus: PaymentStatus.PAID,
    });
    tx.auditLog.create.mockResolvedValue({});
    dependencies.transition.mockResolvedValue({});
    dependencies.compensate.mockResolvedValue(null);
    dependencies.enqueue.mockResolvedValue({});
  });

  it("treats a duplicate status webhook as a no-op", async () => {
    tx.payment.findUnique.mockResolvedValue(
      paymentRecord(PaymentStatus.PENDING),
    );
    const service = new PaymentReconciliationService(
      db as unknown as PrismaClient,
    );

    const result = await service.reconcilePayment(
      "mock-payment-1",
      PaymentStatus.PENDING,
      { amount: 10 },
      "webhook:evt-1",
    );

    expect(result).toMatchObject({ success: true, data: { noop: true } });
    expect(tx.payment.updateMany).not.toHaveBeenCalled();
  });

  it("ignores an out-of-order pending webhook after payment", async () => {
    tx.payment.findUnique.mockResolvedValue(paymentRecord(PaymentStatus.PAID));
    const result = await new PaymentReconciliationService(
      db as unknown as PrismaClient,
    ).reconcilePayment(
      "mock-payment-1",
      PaymentStatus.PENDING,
      { amount: 10 },
      "webhook:evt-2",
    );

    expect(result).toMatchObject({
      success: true,
      data: { noop: true, ignored: true, reason: "OUT_OF_ORDER" },
    });
    expect(tx.paymentEvent.create).not.toHaveBeenCalled();
  });

  it("atomically applies a paid webhook and records audit/outbox", async () => {
    tx.payment.findUnique.mockResolvedValue(
      paymentRecord(PaymentStatus.PENDING),
    );
    const result = await new PaymentReconciliationService(
      db as unknown as PrismaClient,
    ).reconcilePayment(
      "mock-payment-1",
      PaymentStatus.PAID,
      { amount: 10 },
      "webhook:evt-3",
    );

    expect(result.success).toBe(true);
    expect(tx.payment.updateMany).toHaveBeenCalledWith({
      where: { id: PAYMENT_ID, status: PaymentStatus.PENDING },
      data: { status: PaymentStatus.PAID },
    });
    expect(tx.paymentEvent.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ idempotencyKey: "webhook:evt-3" }),
    });
    expect(dependencies.transition).toHaveBeenCalledOnce();
    expect(tx.auditLog.create).toHaveBeenCalledOnce();
    expect(dependencies.enqueue).toHaveBeenCalledOnce();
  });

  it("rejects a paid webhook whose amount does not match", async () => {
    tx.payment.findUnique.mockResolvedValue(
      paymentRecord(PaymentStatus.PENDING),
    );
    const result = await new PaymentReconciliationService(
      db as unknown as PrismaClient,
    ).reconcilePayment(
      "mock-payment-1",
      PaymentStatus.PAID,
      { amount: 9.99 },
      "webhook:evt-4",
    );

    expect(result).toMatchObject({
      success: false,
      error: { code: "BUSINESS_RULE" },
    });
    expect(tx.payment.updateMany).not.toHaveBeenCalled();
  });

  it("retries and fails safely when a concurrent transition wins", async () => {
    tx.payment.findUnique.mockResolvedValue(
      paymentRecord(PaymentStatus.PENDING),
    );
    tx.payment.updateMany.mockResolvedValue({ count: 0 });
    const result = await new PaymentReconciliationService(
      db as unknown as PrismaClient,
    ).reconcilePayment(
      "mock-payment-1",
      PaymentStatus.PAID,
      { amount: 10 },
      "webhook:evt-5",
    );

    expect(result).toMatchObject({
      success: false,
      error: { code: "CONFLICT" },
    });
    expect(db.$transaction).toHaveBeenCalledTimes(3);
    expect(tx.paymentEvent.create).not.toHaveBeenCalled();
  });
});

describe("PaymentRefundService", () => {
  const processRefund = vi.fn();
  const adapter: PaymentAdapterContract = {
    createIntent: vi.fn(),
    verifyTransaction: vi.fn(),
    processRefund,
    handleWebhook: vi.fn(),
  };
  const registry = new PaymentRegistry(adapter);
  const tx = {
    paymentEvent: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    payment: {
      findFirst: vi.fn(),
      updateMany: vi.fn(),
    },
    order: { update: vi.fn() },
    auditLog: { create: vi.fn() },
  };
  const db = {
    user: { findUnique: vi.fn() },
    $transaction: vi.fn(
      async (operation: (client: typeof tx) => Promise<unknown>) =>
        operation(tx),
    ),
    paymentEvent: { findUnique: vi.fn() },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    db.user.findUnique.mockResolvedValue({ role: "admin" });
    db.$transaction.mockImplementation(
      async (operation: (client: typeof tx) => Promise<unknown>) =>
        operation(tx),
    );
    tx.paymentEvent.findUnique.mockResolvedValue(null);
    tx.paymentEvent.create.mockResolvedValue({ id: "refund-event-1" });
    tx.payment.updateMany.mockResolvedValue({ count: 1 });
    tx.order.update.mockResolvedValue({ id: ORDER_ID, orderNo: "ORD-100" });
    tx.auditLog.create.mockResolvedValue({});
    processRefund.mockResolvedValue({
      success: true,
      data: {
        refundRef: "refund-1",
        amount: 0.11,
        status: "REFUNDED",
        rawResponse: {},
      },
    });
    dependencies.enqueue.mockResolvedValue({});
  });

  it("rejects non-positive amounts before opening a transaction", async () => {
    const result = await new PaymentRefundService(
      db as unknown as PrismaClient,
      registry,
    ).refundPayment(ACTOR_ID, ORDER_ID, 0, "Invalid refund");

    expect(result).toMatchObject({
      success: false,
      error: { code: "BUSINESS_RULE" },
    });
    expect(db.$transaction).not.toHaveBeenCalled();
  });

  it("rounds in decimal currency precision and records cumulative amount", async () => {
    tx.payment.findFirst.mockResolvedValue({
      ...paymentRecord(PaymentStatus.PAID),
      order: { id: ORDER_ID, orderNo: "ORD-100" },
      amount: new Prisma.Decimal("1.00"),
    });
    const result = await new PaymentRefundService(
      db as unknown as PrismaClient,
      registry,
    ).refundPayment(
      ACTOR_ID,
      ORDER_ID,
      0.105,
      "Partial return",
      "refund:key-1",
    );

    expect(result).toMatchObject({
      success: true,
      data: {
        refundedAmount: "0.11",
        cumulativeRefundedAmount: "0.11",
        newStatus: PaymentStatus.PARTIALLY_REFUNDED,
      },
    });
    expect(tx.payment.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          refundedAmount: { increment: new Prisma.Decimal("0.11") },
          status: PaymentStatus.PARTIALLY_REFUNDED,
        },
      }),
    );
    expect(tx.auditLog.create).toHaveBeenCalledOnce();
    expect(dependencies.enqueue).toHaveBeenCalledOnce();
  });

  it("prevents cumulative over-refund before calling the provider", async () => {
    tx.payment.findFirst.mockResolvedValue({
      ...paymentRecord(PaymentStatus.PARTIALLY_REFUNDED),
      order: { id: ORDER_ID, orderNo: "ORD-100" },
      refundedAmount: new Prisma.Decimal("9.99"),
    });
    const result = await new PaymentRefundService(
      db as unknown as PrismaClient,
      registry,
    ).refundPayment(
      ACTOR_ID,
      ORDER_ID,
      0.02,
      "Too much refund",
      "refund:key-2",
    );

    expect(result).toMatchObject({
      success: false,
      error: { code: "BUSINESS_RULE" },
    });
    expect(processRefund).not.toHaveBeenCalled();
    expect(tx.payment.updateMany).not.toHaveBeenCalled();
  });

  it("does not call the provider when a concurrent refund wins", async () => {
    tx.payment.findFirst.mockResolvedValue({
      ...paymentRecord(PaymentStatus.PAID),
      order: { id: ORDER_ID, orderNo: "ORD-100" },
    });
    tx.payment.updateMany.mockResolvedValue({ count: 0 });
    const result = await new PaymentRefundService(
      db as unknown as PrismaClient,
      registry,
    ).refundPayment(ACTOR_ID, ORDER_ID, 1, "Concurrent refund", "refund:key-3");

    expect(result).toMatchObject({
      success: false,
      error: { code: "CONFLICT" },
    });
    expect(db.$transaction).toHaveBeenCalledTimes(3);
    expect(processRefund).not.toHaveBeenCalled();
  });
});

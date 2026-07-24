import {
  FulfillmentStatus,
  OrderStatus,
  OrderTransitionKind,
  type Prisma,
} from "@prisma/client";
import { describe, expect, it, vi } from "vitest";

import { ErrorCode } from "src/lib/errors";
import {
  OrderTransitionService,
  recordInitialOrderStateInTransaction,
  type TransactionRunner,
} from "src/lib/services/order-transition";

function transitionTx(orderOverrides: Record<string, unknown> = {}) {
  return {
    order: {
      findUnique: vi.fn().mockResolvedValue({
        id: "order-1",
        orderNo: "ORD-1",
        status: OrderStatus.pending,
        fulfillmentStatus: FulfillmentStatus.UNFULFILLED,
        statusVersion: 0,
        ...orderOverrides,
      }),
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
    },
    orderStatusHistory: {
      create: vi.fn().mockResolvedValue({ id: "history-1" }),
    },
    auditLog: {
      create: vi.fn().mockResolvedValue({ id: "audit-1" }),
    },
    outboxEvent: {
      create: vi.fn().mockResolvedValue({ id: "event-1" }),
    },
  };
}

function runner(tx: ReturnType<typeof transitionTx>): TransactionRunner {
  return {
    $transaction: vi.fn(async (callback) =>
      callback(tx as unknown as Prisma.TransactionClient),
    ),
  };
}

describe("OrderTransitionService", () => {
  it("atomically writes an allowed order transition, history, audit, and outbox", async () => {
    const tx = transitionTx();
    const service = new OrderTransitionService(runner(tx));

    const result = await service.transitionOrder({
      orderId: "order-1",
      toStatus: OrderStatus.confirmed,
      expectedVersion: 0,
      actorId: "admin-1",
      reason: "Payment and stock verified",
    });

    expect(result).toMatchObject({
      success: true,
      data: {
        kind: OrderTransitionKind.ORDER,
        fromStatus: OrderStatus.pending,
        toStatus: OrderStatus.confirmed,
        statusVersion: 1,
        sequence: 1,
      },
    });
    expect(tx.order.updateMany).toHaveBeenCalledWith({
      where: {
        id: "order-1",
        status: OrderStatus.pending,
        statusVersion: 0,
      },
      data: {
        status: OrderStatus.confirmed,
        statusVersion: { increment: 1 },
      },
    });
    expect(tx.orderStatusHistory.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        sequence: 1,
        kind: OrderTransitionKind.ORDER,
        fromOrderStatus: OrderStatus.pending,
        toOrderStatus: OrderStatus.confirmed,
      }),
    });
    expect(tx.auditLog.create).toHaveBeenCalledTimes(1);
    expect(tx.outboxEvent.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        eventType: "order.status.changed",
        idempotencyKey: "order:order-1:transition:1",
      }),
    });
  });

  it("rejects a stale expected version before writing", async () => {
    const tx = transitionTx({ statusVersion: 3 });
    const service = new OrderTransitionService(runner(tx));

    const result = await service.transitionOrder({
      orderId: "order-1",
      toStatus: OrderStatus.confirmed,
      expectedVersion: 2,
      actorId: "admin-1",
      reason: "Confirm order",
    });

    expect(result).toMatchObject({
      success: false,
      error: { code: ErrorCode.CONFLICT },
    });
    expect(tx.order.updateMany).not.toHaveBeenCalled();
    expect(tx.orderStatusHistory.create).not.toHaveBeenCalled();
  });

  it("rejects an illegal transition without side effects", async () => {
    const tx = transitionTx();
    const service = new OrderTransitionService(runner(tx));

    const result = await service.transitionOrder({
      orderId: "order-1",
      toStatus: OrderStatus.completed,
      expectedVersion: 0,
      actorId: "admin-1",
      reason: "Skip directly to completed",
    });

    expect(result).toMatchObject({
      success: false,
      error: { code: ErrorCode.BUSINESS_RULE },
    });
    expect(tx.order.updateMany).not.toHaveBeenCalled();
    expect(tx.outboxEvent.create).not.toHaveBeenCalled();
  });

  it("rejects a concurrent compare-and-swap loss", async () => {
    const tx = transitionTx();
    tx.order.updateMany.mockResolvedValue({ count: 0 });
    const service = new OrderTransitionService(runner(tx));

    const result = await service.transitionOrder({
      orderId: "order-1",
      toStatus: OrderStatus.confirmed,
      expectedVersion: 0,
      actorId: "admin-1",
      reason: "Confirm order",
    });

    expect(result).toMatchObject({
      success: false,
      error: { code: ErrorCode.CONFLICT },
    });
    expect(tx.orderStatusHistory.create).not.toHaveBeenCalled();
  });

  it("writes fulfillment transitions to the shared immutable sequence", async () => {
    const tx = transitionTx({ statusVersion: 4 });
    const service = new OrderTransitionService(runner(tx));

    const result = await service.transitionFulfillment({
      orderId: "order-1",
      toStatus: FulfillmentStatus.PROCESSING,
      expectedVersion: 4,
      actorId: "support-1",
      reason: "Packing started",
    });

    expect(result).toMatchObject({
      success: true,
      data: {
        kind: OrderTransitionKind.FULFILLMENT,
        statusVersion: 5,
        sequence: 5,
      },
    });
    expect(tx.orderStatusHistory.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        sequence: 5,
        kind: OrderTransitionKind.FULFILLMENT,
        fromFulfillmentStatus: FulfillmentStatus.UNFULFILLED,
        toFulfillmentStatus: FulfillmentStatus.PROCESSING,
      }),
    });
    expect(tx.outboxEvent.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        eventType: "order.fulfillment.changed",
        idempotencyKey: "order:order-1:transition:5",
      }),
    });
  });
});

describe("recordInitialOrderStateInTransaction", () => {
  it("creates sequence one and an idempotent placed event", async () => {
    const tx = transitionTx();

    await recordInitialOrderStateInTransaction(
      tx as unknown as Prisma.TransactionClient,
      {
        orderId: "order-1",
        orderNo: "ORD-1",
        userId: "customer-1",
        orderStatus: OrderStatus.pending,
        fulfillmentStatus: FulfillmentStatus.UNFULFILLED,
        paymentStatus: "PENDING_COLLECTION",
      },
    );

    expect(tx.orderStatusHistory.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        orderId: "order-1",
        sequence: 1,
        fromOrderStatus: null,
        toOrderStatus: OrderStatus.pending,
      }),
    });
    expect(tx.outboxEvent.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        eventType: "order.placed",
        idempotencyKey: "order:order-1:placed",
      }),
    });
  });
});

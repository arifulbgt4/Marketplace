import {
  OutboxStatus,
  type OutboxEvent,
  type Prisma,
  type PrismaClient,
} from "@prisma/client";
import { describe, expect, it, vi } from "vitest";

import { OutboxProcessor, enqueueOutboxEvent } from "src/lib/services/outbox";

const NOW = new Date("2026-07-24T12:00:00.000Z");

function event(overrides: Partial<OutboxEvent> = {}): OutboxEvent {
  return {
    id: "event-1",
    aggregateType: "order",
    aggregateId: "order-1",
    eventType: "order.placed",
    payload: { orderId: "order-1" },
    status: OutboxStatus.PROCESSING,
    attempts: 1,
    availableAt: NOW,
    lockedAt: NOW,
    lockedBy: "worker-1",
    publishedAt: null,
    lastError: null,
    idempotencyKey: "order:order-1:placed",
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  };
}

function processorDb(claimedEvent: OutboxEvent) {
  const txOutbox = {
    findMany: vi.fn().mockResolvedValue([{ id: claimedEvent.id }]),
    updateMany: vi.fn().mockResolvedValue({ count: 1 }),
    findUnique: vi.fn().mockResolvedValue(claimedEvent),
  };
  const dbOutbox = {
    updateMany: vi.fn().mockResolvedValue({ count: 1 }),
  };
  const db = {
    outboxEvent: dbOutbox,
    $transaction: vi.fn(async (callback) =>
      callback({
        outboxEvent: txOutbox,
      } as unknown as Prisma.TransactionClient),
    ),
  };
  return { db, dbOutbox, txOutbox };
}

describe("enqueueOutboxEvent", () => {
  it("writes through the caller transaction with a required idempotency key", async () => {
    const create = vi.fn().mockResolvedValue(event());
    const tx = {
      outboxEvent: { create },
    } as unknown as Prisma.TransactionClient;

    await enqueueOutboxEvent(tx, {
      aggregateType: "order",
      aggregateId: "order-1",
      eventType: "order.placed",
      payload: { orderId: "order-1" },
      idempotencyKey: "order:order-1:placed",
    });

    expect(create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        aggregateType: "order",
        aggregateId: "order-1",
        eventType: "order.placed",
        idempotencyKey: "order:order-1:placed",
      }),
    });
  });
});

describe("OutboxProcessor", () => {
  it("claims and publishes an event", async () => {
    const claimedEvent = event();
    const { db, dbOutbox } = processorDb(claimedEvent);
    const publisher = vi.fn().mockResolvedValue(undefined);
    const processor = new OutboxProcessor(
      db as unknown as PrismaClient,
      () => NOW,
    );

    const result = await processor.processBatch({
      workerId: "worker-1",
      publisher,
    });

    expect(result).toEqual({
      claimed: 1,
      published: 1,
      retried: 0,
      failed: 0,
    });
    expect(publisher).toHaveBeenCalledWith(claimedEvent);
    expect(dbOutbox.updateMany).toHaveBeenCalledWith({
      where: {
        id: "event-1",
        status: OutboxStatus.PROCESSING,
        lockedBy: "worker-1",
      },
      data: expect.objectContaining({
        status: OutboxStatus.PUBLISHED,
        publishedAt: NOW,
        lockedAt: null,
        lockedBy: null,
      }),
    });
  });

  it("releases a failed delivery for a later retry", async () => {
    const { db, dbOutbox } = processorDb(event({ attempts: 2 }));
    const processor = new OutboxProcessor(
      db as unknown as PrismaClient,
      () => NOW,
    );

    const result = await processor.processBatch({
      workerId: "worker-1",
      publisher: vi.fn().mockRejectedValue(new Error("provider unavailable")),
      maxAttempts: 3,
      retryDelayMs: 1_000,
    });

    expect(result).toEqual({
      claimed: 1,
      published: 0,
      retried: 1,
      failed: 0,
    });
    expect(dbOutbox.updateMany).toHaveBeenCalledWith({
      where: expect.objectContaining({ id: "event-1" }),
      data: expect.objectContaining({
        status: OutboxStatus.PENDING,
        availableAt: new Date(NOW.getTime() + 1_000),
        lastError: "Publisher delivery failed",
      }),
    });
  });

  it("marks an event failed after its final attempt", async () => {
    const { db, dbOutbox } = processorDb(event({ attempts: 3 }));
    const processor = new OutboxProcessor(
      db as unknown as PrismaClient,
      () => NOW,
    );

    const result = await processor.processBatch({
      workerId: "worker-1",
      publisher: vi.fn().mockRejectedValue(new Error("permanent failure")),
      maxAttempts: 3,
    });

    expect(result.failed).toBe(1);
    expect(result.retried).toBe(0);
    expect(dbOutbox.updateMany).toHaveBeenCalledWith({
      where: expect.objectContaining({ id: "event-1" }),
      data: expect.objectContaining({
        status: OutboxStatus.FAILED,
        lastError: "Publisher delivery failed",
      }),
    });
  });

  it("caps a requested batch before querying candidates", async () => {
    const { db, txOutbox } = processorDb(event());
    const processor = new OutboxProcessor(
      db as unknown as PrismaClient,
      () => NOW,
    );

    await processor.processBatch({
      workerId: "worker-1",
      publisher: vi.fn().mockResolvedValue(undefined),
      batchSize: 10_000,
    });

    expect(txOutbox.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 100 }),
    );
  });
});

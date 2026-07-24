import { OutboxStatus, type OutboxEvent } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";

import { OutboxWorkerRunner } from "src/lib/services/outbox-worker-runner";

const NOW = new Date("2026-07-25T00:00:00.000Z");

const sourceEvent: OutboxEvent = {
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
};

describe("OutboxWorkerRunner", () => {
  it("dispatches claimed events to the injected publisher contract", async () => {
    const publisher = vi.fn().mockResolvedValue(undefined);
    const processBatch = vi.fn(async (input) => {
      await input.publisher(sourceEvent);
      return {
        claimed: 1,
        published: 1,
        retried: 0,
        failed: 0,
      };
    });
    const runner = new OutboxWorkerRunner(
      { processBatch },
      publisher,
      () => "worker-invocation-1",
    );

    const result = await runner.run({
      OUTBOX_WORKER_BATCH_SIZE: 25,
      OUTBOX_WORKER_MAX_ATTEMPTS: 5,
      OUTBOX_WORKER_RETRY_DELAY_MS: 30_000,
      OUTBOX_WORKER_LOCK_TIMEOUT_MS: 300_000,
    });

    expect(result).toEqual({
      claimed: 1,
      published: 1,
      retried: 0,
      failed: 0,
    });
    expect(publisher).toHaveBeenCalledOnce();
    expect(publisher).toHaveBeenCalledWith(sourceEvent);
    expect(processBatch).toHaveBeenCalledWith({
      workerId: "worker-invocation-1",
      publisher,
      batchSize: 25,
      maxAttempts: 5,
      retryDelayMs: 30_000,
      lockTimeoutMs: 300_000,
    });
  });
});

import {
  OutboxStatus,
  Prisma,
  type OutboxEvent,
  type PrismaClient,
} from "@prisma/client";

import { MAX_OUTBOX_WORKER_BATCH_SIZE } from "src/lib/outbox-worker-config";
import { prisma } from "src/lib/prisma";

export type EnqueueOutboxEventInput = Readonly<{
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  payload: Prisma.InputJsonValue;
  idempotencyKey: string;
  availableAt?: Date;
}>;

export async function enqueueOutboxEvent(
  tx: Prisma.TransactionClient,
  input: EnqueueOutboxEventInput,
): Promise<OutboxEvent> {
  return tx.outboxEvent.create({
    data: {
      aggregateType: input.aggregateType,
      aggregateId: input.aggregateId,
      eventType: input.eventType,
      payload: input.payload,
      idempotencyKey: input.idempotencyKey,
      availableAt: input.availableAt,
    },
  });
}

export type OutboxPublisher = (event: OutboxEvent) => Promise<void>;

export type ProcessOutboxBatchInput = Readonly<{
  workerId: string;
  publisher: OutboxPublisher;
  batchSize?: number;
  maxAttempts?: number;
  retryDelayMs?: number;
  lockTimeoutMs?: number;
}>;

export type ProcessOutboxBatchResult = Readonly<{
  claimed: number;
  published: number;
  retried: number;
  failed: number;
}>;

function boundedBatchSize(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) return 25;
  return Math.min(Math.max(Math.trunc(value), 1), MAX_OUTBOX_WORKER_BATCH_SIZE);
}

export class OutboxProcessor {
  constructor(
    private readonly db: PrismaClient = prisma,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async processBatch(
    input: ProcessOutboxBatchInput,
  ): Promise<ProcessOutboxBatchResult> {
    const batchSize = boundedBatchSize(input.batchSize);
    const maxAttempts = input.maxAttempts ?? 5;
    const retryDelayMs = input.retryDelayMs ?? 30_000;
    const lockTimeoutMs = input.lockTimeoutMs ?? 5 * 60_000;
    const claimed = await this.claim(input.workerId, batchSize, lockTimeoutMs);

    let published = 0;
    let retried = 0;
    let failed = 0;

    for (const event of claimed) {
      try {
        await input.publisher(event);
        const result = await this.db.outboxEvent.updateMany({
          where: {
            id: event.id,
            status: OutboxStatus.PROCESSING,
            lockedBy: input.workerId,
          },
          data: {
            status: OutboxStatus.PUBLISHED,
            publishedAt: this.now(),
            lockedAt: null,
            lockedBy: null,
            lastError: null,
          },
        });
        published += result.count;
      } catch {
        const exhausted = event.attempts >= maxAttempts;
        await this.db.outboxEvent.updateMany({
          where: {
            id: event.id,
            status: OutboxStatus.PROCESSING,
            lockedBy: input.workerId,
          },
          data: {
            status: exhausted ? OutboxStatus.FAILED : OutboxStatus.PENDING,
            availableAt: exhausted
              ? event.availableAt
              : new Date(this.now().getTime() + retryDelayMs),
            lockedAt: null,
            lockedBy: null,
            lastError: "Publisher delivery failed",
          },
        });
        if (exhausted) failed += 1;
        else retried += 1;
      }
    }

    return {
      claimed: claimed.length,
      published,
      retried,
      failed,
    };
  }

  private async claim(
    workerId: string,
    batchSize: number,
    lockTimeoutMs: number,
  ): Promise<OutboxEvent[]> {
    const now = this.now();
    const staleBefore = new Date(now.getTime() - lockTimeoutMs);

    return this.db.$transaction(async (tx) => {
      const candidates = await tx.outboxEvent.findMany({
        where: {
          availableAt: { lte: now },
          OR: [
            { status: OutboxStatus.PENDING },
            {
              status: OutboxStatus.PROCESSING,
              lockedAt: { lt: staleBefore },
            },
          ],
        },
        orderBy: [{ availableAt: "asc" }, { createdAt: "asc" }],
        take: batchSize,
      });
      const claimed: OutboxEvent[] = [];

      for (const candidate of candidates) {
        const result = await tx.outboxEvent.updateMany({
          where: {
            id: candidate.id,
            availableAt: { lte: now },
            OR: [
              { status: OutboxStatus.PENDING },
              {
                status: OutboxStatus.PROCESSING,
                lockedAt: { lt: staleBefore },
              },
            ],
          },
          data: {
            status: OutboxStatus.PROCESSING,
            lockedAt: now,
            lockedBy: workerId,
            attempts: { increment: 1 },
          },
        });

        if (result.count !== 1) continue;
        const event = await tx.outboxEvent.findUnique({
          where: { id: candidate.id },
        });
        if (event) claimed.push(event);
      }

      return claimed;
    });
  }
}

export const outboxProcessor = new OutboxProcessor();

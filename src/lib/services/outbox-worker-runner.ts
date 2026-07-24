import { randomUUID } from "crypto";

import type { OutboxWorkerConfig } from "src/lib/outbox-worker-config";
import { publishCommerceEmail } from "src/lib/services/commerce-email-outbox-publisher";
import { composeOutboxPublishers } from "src/lib/services/composite-outbox-publisher";
import { publishInAppNotification } from "src/lib/services/in-app-notification-publisher";
import {
  outboxProcessor,
  type OutboxPublisher,
  type ProcessOutboxBatchInput,
  type ProcessOutboxBatchResult,
} from "src/lib/services/outbox";

type OutboxBatchProcessor = {
  processBatch(
    input: ProcessOutboxBatchInput,
  ): Promise<ProcessOutboxBatchResult>;
};

type RunnableOutboxConfig = Omit<OutboxWorkerConfig, "OUTBOX_WORKER_SECRET">;

export const publishCustomerNotifications = composeOutboxPublishers(
  publishInAppNotification,
  publishCommerceEmail,
);

export class OutboxWorkerRunner {
  constructor(
    private readonly processor: OutboxBatchProcessor = outboxProcessor,
    private readonly publisher: OutboxPublisher = publishCustomerNotifications,
    private readonly workerId: () => string = () =>
      `internal-outbox-${randomUUID()}`,
  ) {}

  run(config: RunnableOutboxConfig): Promise<ProcessOutboxBatchResult> {
    return this.processor.processBatch({
      workerId: this.workerId(),
      publisher: this.publisher,
      batchSize: config.OUTBOX_WORKER_BATCH_SIZE,
      maxAttempts: config.OUTBOX_WORKER_MAX_ATTEMPTS,
      retryDelayMs: config.OUTBOX_WORKER_RETRY_DELAY_MS,
      lockTimeoutMs: config.OUTBOX_WORKER_LOCK_TIMEOUT_MS,
    });
  }
}

export const outboxWorkerRunner = new OutboxWorkerRunner();

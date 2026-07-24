import type { OutboxEvent } from "@prisma/client";

import type { OutboxPublisher } from "src/lib/services/outbox";

/**
 * Publishers run in declaration order. The default runner puts the idempotent
 * in-app write first and SMTP last, so no fallible work follows a successful
 * external email send.
 */
export function composeOutboxPublishers(
  ...publishers: readonly OutboxPublisher[]
): OutboxPublisher {
  return async (event: OutboxEvent) => {
    for (const publisher of publishers) {
      await publisher(event);
    }
  };
}

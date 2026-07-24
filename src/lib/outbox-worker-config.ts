import { createHash, timingSafeEqual } from "crypto";
import { z } from "zod";

export const MAX_OUTBOX_WORKER_BATCH_SIZE = 100;

const optionalWorkerSecret = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z.string().trim().min(32).optional(),
);

export const outboxWorkerEnvSchema = z.object({
  OUTBOX_WORKER_SECRET: optionalWorkerSecret,
  OUTBOX_WORKER_BATCH_SIZE: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_OUTBOX_WORKER_BATCH_SIZE)
    .default(25),
  OUTBOX_WORKER_MAX_ATTEMPTS: z.coerce.number().int().min(1).max(20).default(5),
  OUTBOX_WORKER_RETRY_DELAY_MS: z.coerce
    .number()
    .int()
    .min(1_000)
    .max(24 * 60 * 60 * 1_000)
    .default(30_000),
  OUTBOX_WORKER_LOCK_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .min(10_000)
    .max(60 * 60 * 1_000)
    .default(5 * 60_000),
});

export type OutboxWorkerConfig = z.infer<typeof outboxWorkerEnvSchema>;

function digest(value: string) {
  return createHash("sha256").update(value, "utf8").digest();
}

function bearerToken(authorization: string | null): string | null {
  if (!authorization) return null;
  const match = authorization.match(/^Bearer ([^\s]+)$/i);
  return match?.[1] ?? null;
}

export function authenticateOutboxWorker(
  authorization: string | null,
  configuredSecret: string | undefined,
): boolean {
  if (!configuredSecret) return false;
  const candidate = bearerToken(authorization);
  if (!candidate) return false;
  return timingSafeEqual(digest(candidate), digest(configuredSecret));
}

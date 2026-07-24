import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "src/app/api/internal/outbox/route";
import {
  authenticateOutboxWorker,
  outboxWorkerEnvSchema,
} from "src/lib/outbox-worker-config";

const worker = vi.hoisted(() => ({
  run: vi.fn(),
}));

vi.mock("src/lib/services/outbox-worker-runner", () => ({
  outboxWorkerRunner: worker,
}));

const SECRET = "outbox-worker-secret-with-at-least-32-characters";

function request(authorization?: string) {
  return new NextRequest("http://localhost/api/internal/outbox", {
    method: "POST",
    headers: authorization ? { authorization } : undefined,
  });
}

describe("internal outbox worker authentication", () => {
  beforeEach(() => {
    vi.stubEnv("OUTBOX_WORKER_SECRET", SECRET);
    vi.stubEnv("OUTBOX_WORKER_BATCH_SIZE", "25");
    vi.stubEnv("OUTBOX_WORKER_MAX_ATTEMPTS", "5");
    vi.stubEnv("OUTBOX_WORKER_RETRY_DELAY_MS", "30000");
    vi.stubEnv("OUTBOX_WORKER_LOCK_TIMEOUT_MS", "300000");
    worker.run.mockReset();
    worker.run.mockResolvedValue({
      claimed: 4,
      published: 2,
      retried: 1,
      failed: 1,
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("compares fixed-length digests and rejects invalid bearer values", () => {
    expect(authenticateOutboxWorker(`Bearer ${SECRET}`, SECRET)).toBe(true);
    expect(authenticateOutboxWorker("Bearer short", SECRET)).toBe(false);
    expect(authenticateOutboxWorker("Basic credentials", SECRET)).toBe(false);
    expect(authenticateOutboxWorker(null, SECRET)).toBe(false);
    expect(authenticateOutboxWorker(`Bearer ${SECRET}`, undefined)).toBe(false);
  });

  it("fails closed when the worker secret is missing", async () => {
    vi.stubEnv("OUTBOX_WORKER_SECRET", "");

    const response = await POST(request(`Bearer ${SECRET}`));

    expect(response.status).toBe(503);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(await response.json()).toEqual({ error: "Worker unavailable" });
    expect(worker.run).not.toHaveBeenCalled();
  });

  it("rejects an invalid token without running the worker", async () => {
    const response = await POST(request("Bearer wrong-secret"));

    expect(response.status).toBe(401);
    expect(response.headers.get("www-authenticate")).toBe("Bearer");
    expect(await response.json()).toEqual({ error: "Unauthorized" });
    expect(worker.run).not.toHaveBeenCalled();
  });

  it("returns counts only after an authenticated bounded run", async () => {
    const response = await POST(request(`Bearer ${SECRET}`));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(body).toEqual({
      claimed: 4,
      published: 2,
      retried: 1,
      failed: 1,
    });
    expect(JSON.stringify(body)).not.toContain("payload");
    expect(worker.run).toHaveBeenCalledWith(
      expect.objectContaining({
        OUTBOX_WORKER_BATCH_SIZE: 25,
        OUTBOX_WORKER_MAX_ATTEMPTS: 5,
      }),
    );
  });

  it("rejects unsafe worker configuration before dispatch", async () => {
    vi.stubEnv("OUTBOX_WORKER_BATCH_SIZE", "101");

    const response = await POST(request(`Bearer ${SECRET}`));

    expect(response.status).toBe(503);
    expect(worker.run).not.toHaveBeenCalled();
  });

  it("does not expose worker errors or event data", async () => {
    worker.run.mockRejectedValueOnce(
      new Error("customer@example.com private event payload"),
    );

    const response = await POST(request(`Bearer ${SECRET}`));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ error: "Worker execution failed" });
    expect(JSON.stringify(body)).not.toContain("customer@example.com");
    expect(JSON.stringify(body)).not.toContain("payload");
  });

  it("validates optional secret length and operational bounds", () => {
    expect(outboxWorkerEnvSchema.safeParse({}).success).toBe(true);
    expect(
      outboxWorkerEnvSchema.safeParse({
        OUTBOX_WORKER_SECRET: "too-short",
      }).success,
    ).toBe(false);
    expect(
      outboxWorkerEnvSchema.safeParse({
        OUTBOX_WORKER_BATCH_SIZE: 0,
      }).success,
    ).toBe(false);
  });
});

import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getAuthSession: vi.fn(),
  create: vi.fn(),
}));

vi.mock("src/lib/authz", () => ({
  getAuthSession: mocks.getAuthSession,
}));

vi.mock("src/lib/services/support-request", () => ({
  supportRequestService: { create: mocks.create },
}));

import { POST } from "src/app/api/support/route";
import { ok } from "src/lib/errors";

const body = {
  source: "CONTACT",
  name: "Customer One",
  email: "customer@example.com",
  subject: "Order question",
  message: "I need help understanding the status of my order.",
};

describe("support request public route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getAuthSession.mockResolvedValue(null);
    mocks.create.mockResolvedValue(
      ok({
        accepted: true,
        reference: "SUP-20260725-ABCDEF123456",
        status: "OPEN",
      }),
    );
  });

  it("accepts an anonymous request without returning submitted PII", async () => {
    const response = await POST(
      new NextRequest("http://localhost/api/support", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "203.0.113.21",
        },
        body: JSON.stringify(body),
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(202);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(payload).toEqual({
      accepted: true,
      reference: "SUP-20260725-ABCDEF123456",
      status: "OPEN",
    });
    expect(JSON.stringify(payload)).not.toContain("customer@example.com");
    expect(mocks.create).toHaveBeenCalledWith(null, body);
  });

  it("returns a safe validation error for malformed JSON", async () => {
    const response = await POST(
      new NextRequest("http://localhost/api/support", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "203.0.113.22",
        },
        body: "{",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      code: "VALIDATION_ERROR",
      message: "Invalid JSON request body",
    });
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("rate limits repeated anonymous intake before persistence", async () => {
    const request = () =>
      new NextRequest("http://localhost/api/support", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "203.0.113.23",
        },
        body: JSON.stringify(body),
      });

    for (let attempt = 0; attempt < 8; attempt += 1) {
      expect((await POST(request())).status).toBe(202);
    }
    const blocked = await POST(request());
    const payload = await blocked.json();

    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("x-ratelimit-limited")).toBe("true");
    expect(payload.code).toBe("RATE_LIMITED");
    expect(mocks.create).toHaveBeenCalledTimes(8);
  });
});

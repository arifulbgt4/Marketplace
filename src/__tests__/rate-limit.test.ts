import { describe, it, expect, beforeEach } from "vitest";
import { rateLimit, getRateLimitHeaders } from "src/lib/rate-limit";

describe("Rate Limiter", () => {
  beforeEach(() => {
    // Note: In a real test, we'd clear the store, but since it's a module-level Map,
    // we use unique keys for each test to avoid interference
  });

  it("should allow first request", () => {
    const result = rateLimit("test-1", {
      windowMs: 60000,
      maxRequests: 5,
    });

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("should track multiple requests", () => {
    const key = "test-2";
    const config = { windowMs: 60000, maxRequests: 5 };

    rateLimit(key, config);
    rateLimit(key, config);
    const result = rateLimit(key, config);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it("should block when limit exceeded", () => {
    const key = "test-3";
    const config = { windowMs: 60000, maxRequests: 3 };

    rateLimit(key, config);
    rateLimit(key, config);
    rateLimit(key, config);
    const result = rateLimit(key, config);

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("should return correct headers", () => {
    const result = rateLimit("test-4", {
      windowMs: 60000,
      maxRequests: 10,
    });

    const headers = getRateLimitHeaders(result);

    expect(headers["X-RateLimit-Limited"]).toBe("false");
    expect(headers["X-RateLimit-Remaining"]).toBe("9");
    expect(headers["X-RateLimit-Reset"]).toBeDefined();
  });

  it("should return limited header when blocked", () => {
    const key = "test-5";
    const config = { windowMs: 60000, maxRequests: 1 };

    rateLimit(key, config);
    const result = rateLimit(key, config);

    const headers = getRateLimitHeaders(result);

    expect(headers["X-RateLimit-Limited"]).toBe("true");
    expect(headers["X-RateLimit-Remaining"]).toBe("0");
  });
});

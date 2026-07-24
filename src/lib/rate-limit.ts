import { createHash } from "crypto";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const MAX_RATE_LIMIT_ENTRIES = 10_000;
let requestsSinceCleanup = 0;

const defaultConfig: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10, // 10 requests per window
};

export function rateLimit(
  key: string,
  config: RateLimitConfig = defaultConfig,
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  requestsSinceCleanup += 1;
  if (
    requestsSinceCleanup >= 256 ||
    rateLimitStore.size >= MAX_RATE_LIMIT_ENTRIES
  ) {
    for (const [storedKey, stored] of rateLimitStore) {
      if (stored.resetTime <= now) rateLimitStore.delete(storedKey);
    }
    requestsSinceCleanup = 0;
  }
  while (rateLimitStore.size >= MAX_RATE_LIMIT_ENTRIES) {
    const oldestKey = rateLimitStore.keys().next().value as string | undefined;
    if (!oldestKey) break;
    rateLimitStore.delete(oldestKey);
  }
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }

  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

export function getRateLimitHeaders(
  result: ReturnType<typeof rateLimit>,
): Record<string, string> {
  return {
    "X-RateLimit-Limited": result.allowed ? "false" : "true",
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": Math.ceil(result.resetTime / 1000).toString(),
  };
}

export function requestRateLimitIdentity(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const candidate =
    forwarded || headers.get("x-real-ip")?.trim() || "unknown-client";
  return createHash("sha256")
    .update(candidate.slice(0, 256), "utf8")
    .digest("hex");
}

export function resetRateLimitStoreForTests() {
  rateLimitStore.clear();
  requestsSinceCleanup = 0;
}

export function rateLimitStoreSizeForTests() {
  return rateLimitStore.size;
}

import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getRateLimitHeaders, rateLimit } from "src/lib/rate-limit";
import { accountService } from "src/lib/services/account";
import { accountNotificationService } from "src/lib/services/account-notification";

const requestSchema = z.object({ email: z.string().trim().email() });

export async function POST(request: NextRequest) {
  const requestId = randomUUID();
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const limit = rateLimit(`password-reset:${ip}`, {
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
  });
  if (!limit.allowed) {
    return NextResponse.json(
      {
        code: "RATE_LIMITED",
        message: "Too many requests. Please try again later.",
        requestId,
      },
      { status: 429, headers: getRateLimitHeaders(limit) },
    );
  }

  const parsed = requestSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      {
        code: "VALIDATION_ERROR",
        message: "A valid email is required",
        requestId,
      },
      { status: 400, headers: getRateLimitHeaders(limit) },
    );
  }

  const prepared = await accountService.preparePasswordReset(parsed.data.email);
  let previewUrl: string | undefined;
  if (prepared.shouldSend) {
    try {
      const delivery = await accountNotificationService.sendPasswordReset(
        parsed.data.email,
        prepared.token,
      );
      previewUrl = delivery.previewUrl;
    } catch (error: unknown) {
      console.error("Password reset delivery failed", {
        requestId,
        error: error instanceof Error ? error.message : "unknown",
      });
    }
  }

  return NextResponse.json(
    {
      accepted: true,
      message:
        "If the account exists, password reset instructions will be sent.",
      requestId,
      previewUrl,
    },
    { status: 202, headers: getRateLimitHeaders(limit) },
  );
}

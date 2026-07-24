import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { asAppError, ValidationError } from "src/lib/errors";
import {
  getRateLimitHeaders,
  rateLimit,
  requestRateLimitIdentity,
} from "src/lib/rate-limit";
import { couponService } from "src/lib/services/coupon";

const validationSchema = z.object({
  code: z.string().trim().min(1).max(100),
  subtotal: z.number().finite().min(0).max(999_999_999),
  productIds: z.array(z.string().uuid()).max(100).default([]),
  categoryIds: z.array(z.string().uuid()).max(100).default([]),
});

const PRIVATE_HEADERS = { "Cache-Control": "private, no-store" };

export async function POST(request: NextRequest) {
  try {
    const limit = rateLimit(
      `coupon-validation:${requestRateLimitIdentity(request.headers)}`,
      { windowMs: 60_000, maxRequests: 60 },
    );
    if (!limit.allowed) {
      return NextResponse.json(
        { code: "RATE_LIMITED", message: "Too many requests" },
        {
          status: 429,
          headers: { ...PRIVATE_HEADERS, ...getRateLimitHeaders(limit) },
        },
      );
    }
    const body = await request.json().catch(() => {
      throw new ValidationError("Invalid JSON request body");
    });
    const input = validationSchema.parse(body);
    const result = await couponService.validate(
      input.code,
      input.subtotal,
      input.productIds,
      input.categoryIds,
    );
    if (!result.success) {
      return NextResponse.json(result.error.toSafeJSON(), {
        status: result.error.statusCode,
        headers: PRIVATE_HEADERS,
      });
    }
    return NextResponse.json(result.data, {
      headers: { ...PRIVATE_HEADERS, ...getRateLimitHeaders(limit) },
    });
  } catch (error: unknown) {
    const appError = asAppError(error);
    return NextResponse.json(appError.toSafeJSON(), {
      status: appError.statusCode,
      headers: PRIVATE_HEADERS,
    });
  }
}

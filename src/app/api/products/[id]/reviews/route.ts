import { NextRequest, NextResponse } from "next/server";

import { asAppError, ValidationError } from "src/lib/errors";
import {
  getRateLimitHeaders,
  rateLimit,
  requestRateLimitIdentity,
} from "src/lib/rate-limit";
import { productReviewService } from "src/lib/services/product-review";

type Context = { params: Promise<{ id: string }> };

const PRIVATE_HEADERS = { "Cache-Control": "private, no-store" };
const PUBLIC_HEADERS = {
  "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
};

export async function GET(request: NextRequest, context: Context) {
  try {
    const limit = rateLimit(
      `product-reviews:read:${requestRateLimitIdentity(request.headers)}`,
      { windowMs: 60_000, maxRequests: 240 },
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
    const { id } = await context.params;
    const result = await productReviewService.listPublished(id);
    if (!result.success) {
      return NextResponse.json(result.error.toSafeJSON(), {
        status: result.error.statusCode,
        headers: PRIVATE_HEADERS,
      });
    }
    return NextResponse.json(result.data, {
      headers: { ...PUBLIC_HEADERS, ...getRateLimitHeaders(limit) },
    });
  } catch (error: unknown) {
    const appError = asAppError(error);
    return NextResponse.json(appError.toSafeJSON(), {
      status: appError.statusCode,
      headers: PRIVATE_HEADERS,
    });
  }
}

export async function POST(request: NextRequest, context: Context) {
  try {
    const limit = rateLimit(
      `product-reviews:write:${requestRateLimitIdentity(request.headers)}`,
      { windowMs: 60_000, maxRequests: 20 },
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
    const { id } = await context.params;
    const body = await request.json().catch(() => {
      throw new ValidationError("Invalid JSON request body");
    });
    const result = await productReviewService.create(id, body);
    if (!result.success) {
      return NextResponse.json(result.error.toSafeJSON(), {
        status: result.error.statusCode,
        headers: PRIVATE_HEADERS,
      });
    }
    return NextResponse.json(result.data, {
      status: 201,
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

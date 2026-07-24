import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { asAppError } from "src/lib/errors";
import {
  getRateLimitHeaders,
  rateLimit,
  requestRateLimitIdentity,
} from "src/lib/rate-limit";
import { deliveryService } from "src/lib/services/delivery";

const quoteSchema = z.object({
  country: z.string().trim().min(2).max(100),
  subtotal: z.coerce.number().finite().min(0).max(999_999_999).default(0),
  currency: z
    .string()
    .trim()
    .regex(/^[A-Za-z]{3}$/)
    .transform((value) => value.toUpperCase())
    .default("USD"),
  region: z.string().trim().max(100).optional(),
  postalCode: z.string().trim().max(30).optional(),
  weightGrams: z.coerce.number().finite().min(0).max(999_999_999).default(0),
});

const PRIVATE_HEADERS = { "Cache-Control": "private, no-store" };
const PUBLIC_HEADERS = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
};

export async function GET(request: NextRequest) {
  try {
    const limit = rateLimit(
      `delivery-zones:${requestRateLimitIdentity(request.headers)}`,
      { windowMs: 60_000, maxRequests: 120 },
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
    const { searchParams } = request.nextUrl;
    const country = searchParams.get("country");
    if (country) {
      const parsed = quoteSchema.parse({
        country,
        subtotal: searchParams.get("subtotal") ?? undefined,
        currency: searchParams.get("currency") ?? undefined,
        region: searchParams.get("region") || undefined,
        postalCode: searchParams.get("postalCode") || undefined,
        weightGrams: searchParams.get("weightGrams") ?? undefined,
      });
      const result = await deliveryService.getShippingQuote(
        parsed.subtotal,
        parsed.country,
        parsed.currency,
        parsed.region,
        parsed.postalCode,
        parsed.weightGrams,
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
    }

    const result = await deliveryService.getActiveZones();
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

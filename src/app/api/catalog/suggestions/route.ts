import { NextRequest, NextResponse } from "next/server";

import {
  getRateLimitHeaders,
  rateLimit,
  requestRateLimitIdentity,
} from "src/lib/rate-limit";
import { catalogQueryService } from "src/lib/services/catalog";

const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=0, s-maxage=30, stale-while-revalidate=60",
};

export async function GET(request: NextRequest) {
  const access = rateLimit(
    `catalog-suggestions:${requestRateLimitIdentity(request.headers)}`,
    { windowMs: 60_000, maxRequests: 120 },
  );
  if (!access.allowed) {
    return NextResponse.json(
      { code: "RATE_LIMITED", message: "Too many suggestion requests" },
      {
        status: 429,
        headers: {
          ...getRateLimitHeaders(access),
          "Cache-Control": "private, no-store",
        },
      },
    );
  }
  const { searchParams } = new URL(request.url);
  const result = await catalogQueryService.suggest({
    query: searchParams.get("query") || "",
    limit: searchParams.get("limit") || 8,
  });
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
      headers: { "Cache-Control": "no-store" },
    });
  }
  return NextResponse.json(result.data, { headers: CACHE_HEADERS });
}

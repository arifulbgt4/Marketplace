import { NextRequest, NextResponse } from "next/server";
import {
  getRateLimitHeaders,
  rateLimit,
  requestRateLimitIdentity,
} from "src/lib/rate-limit";
import { catalogQueryService } from "src/lib/services/catalog";

const PUBLIC_CACHE_HEADERS = {
  "Cache-Control": "public, max-age=0, s-maxage=30, stale-while-revalidate=60",
};

export async function GET(request: NextRequest) {
  const access = rateLimit(
    `catalog:${requestRateLimitIdentity(request.headers)}`,
    { windowMs: 60_000, maxRequests: 300 },
  );
  if (!access.allowed) {
    return NextResponse.json(
      { code: "RATE_LIMITED", message: "Too many catalog requests" },
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
  const slug = searchParams.get("slug");
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

  if (slug) {
    const result = await catalogQueryService.getPublishedBySlug(slug);
    if (!result.success) {
      return NextResponse.json(result.error.toSafeJSON(), {
        status: result.error.statusCode,
      });
    }
    return NextResponse.json(result.data, { headers: PUBLIC_CACHE_HEADERS });
  }

  if (category) {
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 24;
    const result = await catalogQueryService.getByCategory(
      category,
      page,
      limit,
    );
    if (!result.success) {
      return NextResponse.json(result.error.toSafeJSON(), {
        status: result.error.statusCode,
      });
    }
    return NextResponse.json(result.data, { headers: PUBLIC_CACHE_HEADERS });
  }

  if (featured === "true") {
    const limit = searchParams.get("limit") || 12;
    const result = await catalogQueryService.getFeatured(limit);
    if (!result.success) {
      return NextResponse.json(result.error.toSafeJSON(), {
        status: result.error.statusCode,
      });
    }
    return NextResponse.json(result.data, { headers: PUBLIC_CACHE_HEADERS });
  }

  const result = await catalogQueryService.search({
    query: searchParams.get("query") || undefined,
    categoryId: searchParams.get("categoryId") || undefined,
    minPrice: searchParams.get("minPrice") || undefined,
    maxPrice: searchParams.get("maxPrice") || undefined,
    sort: searchParams.get("sort") || "newest",
    availability: searchParams.get("availability") || undefined,
    page: searchParams.get("page") || 1,
    limit: searchParams.get("limit") || 24,
  });

  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  }
  return NextResponse.json(result.data, { headers: PUBLIC_CACHE_HEADERS });
}

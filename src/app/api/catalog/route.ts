import { NextRequest, NextResponse } from "next/server";
import { catalogQueryService } from "src/lib/services/catalog";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

  if (slug) {
    const result = await catalogQueryService.getPublishedBySlug(slug);
    if (!result.success) {
      return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
    }
    return NextResponse.json(result.data);
  }

  if (category) {
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 24;
    const result = await catalogQueryService.getByCategory(category, page, limit);
    if (!result.success) {
      return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
    }
    return NextResponse.json(result.data);
  }

  if (featured === "true") {
    const limit = Number(searchParams.get("limit")) || 12;
    const result = await catalogQueryService.getFeatured(limit);
    if (!result.success) {
      return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
    }
    return NextResponse.json(result.data);
  }

  const result = await catalogQueryService.search({
    query: searchParams.get("query") || undefined,
    categoryId: searchParams.get("categoryId") || undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    sort: (searchParams.get("sort") as any) || "newest",
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 24,
  });

  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data);
}

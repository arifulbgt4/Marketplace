import { NextResponse } from "next/server";
import { catalogQueryService } from "src/lib/services/catalog";

export async function GET() {
  const result = await catalogQueryService.getActiveCategories();
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  }
  return NextResponse.json(result.data, {
    headers: {
      "Cache-Control":
        "public, max-age=0, s-maxage=60, stale-while-revalidate=120",
    },
  });
}

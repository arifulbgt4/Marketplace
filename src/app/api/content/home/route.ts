import { NextRequest, NextResponse } from "next/server";

import { contentSectionService } from "src/lib/services/content-section";

export async function GET(request: NextRequest) {
  const locale = new URL(request.url).searchParams.get("locale") || "en";
  const result = await contentSectionService.listPublished(locale);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  }
  return NextResponse.json(result.data, {
    headers: { "cache-control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}

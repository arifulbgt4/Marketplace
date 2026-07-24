import { NextRequest, NextResponse } from "next/server";

import { contentSectionService } from "src/lib/services/content-section";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const result = await contentSectionService.listAdmin({
    locale: searchParams.get("locale") || undefined,
    status: searchParams.get("status") || undefined,
  });
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  }
  return NextResponse.json(result.data);
}

export async function POST(request: NextRequest) {
  const result = await contentSectionService.createDraft(await request.json());
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  }
  return NextResponse.json(result.data, { status: 201 });
}

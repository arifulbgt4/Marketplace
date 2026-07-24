import { NextRequest, NextResponse } from "next/server";

import { customerAdminService } from "src/lib/services/customer-admin";

const PRIVATE_HEADERS = { "Cache-Control": "private, no-store" };

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const result = await customerAdminService.list({
    search: searchParams.get("search") || undefined,
    status: searchParams.get("status") || undefined,
    page: searchParams.get("page") || undefined,
    limit: searchParams.get("limit") || undefined,
  });
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
      headers: PRIVATE_HEADERS,
    });
  }
  return NextResponse.json(result.data, { headers: PRIVATE_HEADERS });
}

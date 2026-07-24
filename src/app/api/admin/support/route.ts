import { NextRequest, NextResponse } from "next/server";

import { getAuthSession } from "src/lib/authz";
import { supportRequestService } from "src/lib/services/support-request";

const PRIVATE_HEADERS = { "Cache-Control": "private, no-store" };

export async function GET(request: NextRequest) {
  const session = await getAuthSession();
  const { searchParams } = new URL(request.url);
  const result = await supportRequestService.listAdmin(session, {
    status: searchParams.get("status") || undefined,
    priority: searchParams.get("priority") || undefined,
    source: searchParams.get("source") || undefined,
    assignedToId: searchParams.get("assignedToId") || undefined,
    unassigned: searchParams.get("unassigned") || undefined,
    search: searchParams.get("search") || undefined,
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

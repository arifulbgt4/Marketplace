import { NextRequest, NextResponse } from "next/server";

import { notificationService } from "src/lib/services/notification";

export async function GET(request: NextRequest) {
  const searchParams = new URL(request.url).searchParams;
  const result = await notificationService.list({
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
    unreadOnly: searchParams.get("unreadOnly") ?? undefined,
  });
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  }
  return NextResponse.json(result.data, {
    headers: { "cache-control": "private, no-store" },
  });
}

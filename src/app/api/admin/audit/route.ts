import { NextRequest, NextResponse } from "next/server";

import { adminReportingService } from "src/lib/services/admin-reporting";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const result = await adminReportingService.audit({
    actorId: searchParams.get("actorId") || undefined,
    action: searchParams.get("action") || undefined,
    targetType: searchParams.get("targetType") || undefined,
    from: searchParams.get("from") || undefined,
    to: searchParams.get("to") || undefined,
    page: searchParams.get("page") || undefined,
    limit: searchParams.get("limit") || undefined,
  });
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  }
  return NextResponse.json(result.data);
}

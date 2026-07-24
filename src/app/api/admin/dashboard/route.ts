import { NextRequest, NextResponse } from "next/server";

import { adminDashboardService } from "src/lib/services/admin-dashboard";

const PRIVATE_HEADERS = { "Cache-Control": "private, no-store" };

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const result = await adminDashboardService.getMetrics({
    dateFrom: searchParams.get("dateFrom") || undefined,
    dateTo: searchParams.get("dateTo") || undefined,
    currency: searchParams.get("currency") || undefined,
  });
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
      headers: PRIVATE_HEADERS,
    });
  }
  return NextResponse.json(result.data, { headers: PRIVATE_HEADERS });
}

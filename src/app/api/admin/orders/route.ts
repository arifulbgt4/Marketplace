import { NextRequest, NextResponse } from "next/server";

import { orderQueryService } from "src/lib/services/order-query";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const result = await orderQueryService.listAdminOrders({
    search: searchParams.get("search") || undefined,
    orderStatus:
      searchParams.get("orderStatus") ||
      searchParams.get("status") ||
      undefined,
    paymentStatus: searchParams.get("paymentStatus") || undefined,
    fulfillmentStatus: searchParams.get("fulfillmentStatus") || undefined,
    paymentMethod: searchParams.get("paymentMethod") || undefined,
    dateFrom: searchParams.get("dateFrom") || undefined,
    dateTo: searchParams.get("dateTo") || undefined,
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

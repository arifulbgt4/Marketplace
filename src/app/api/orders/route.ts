import { NextRequest, NextResponse } from "next/server";
import { legacyFeatureRetiredResponse } from "src/lib/legacy-retirement";
import { orderQueryService } from "src/lib/services/order-query";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const result = await orderQueryService.listCustomerOrders({
    orderStatus:
      searchParams.get("orderStatus") ||
      searchParams.get("status") ||
      undefined,
    paymentStatus: searchParams.get("paymentStatus") || undefined,
    fulfillmentStatus: searchParams.get("fulfillmentStatus") || undefined,
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

export async function POST() {
  return legacyFeatureRetiredResponse({
    feature: "Property booking orders",
    replacement: "/api/checkout/place",
  });
}

import { NextRequest, NextResponse } from "next/server";

import { productReviewService } from "src/lib/services/product-review";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const result = await productReviewService.listAdmin({
    status: searchParams.get("status") || undefined,
    productId: searchParams.get("productId") || undefined,
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

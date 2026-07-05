import { NextRequest, NextResponse } from "next/server";
import { couponService } from "src/lib/services/coupon";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code, userId, subtotal, productIds, categoryIds } = body;
  if (!code || !userId) {
    return NextResponse.json({ code: "VALIDATION_ERROR", message: "code and userId are required" }, { status: 400 });
  }
  const result = await couponService.validate(code, userId, subtotal || 0, productIds, categoryIds);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data);
}

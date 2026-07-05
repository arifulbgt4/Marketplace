import { NextRequest, NextResponse } from "next/server";
import { couponService } from "src/lib/services/coupon";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { code, subtotal, productIds, categoryIds } = body;
  if (!code || !Number.isFinite(subtotal)) {
    return NextResponse.json(
      {
        code: "VALIDATION_ERROR",
        message: "code and numeric subtotal are required",
      },
      { status: 400 },
    );
  }
  const result = await couponService.validate(
    code,
    subtotal,
    productIds,
    categoryIds,
  );
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  }
  return NextResponse.json(result.data);
}

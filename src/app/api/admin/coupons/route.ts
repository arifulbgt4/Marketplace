import { NextRequest, NextResponse } from "next/server";
import { couponService } from "src/lib/services/coupon";

export async function GET() {
  const result = await couponService.list();
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await couponService.create(body);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data, { status: 201 });
}

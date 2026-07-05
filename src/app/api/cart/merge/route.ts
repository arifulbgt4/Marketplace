import { NextRequest, NextResponse } from "next/server";
import { cartService } from "src/lib/services/cart";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await cartService.merge(body.sessionToken);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data);
}

import { NextRequest, NextResponse } from "next/server";
import { CART_COOKIE_NAME, verifyCartToken } from "src/lib/cart-identity";
import { cartService } from "src/lib/services/cart";

export async function POST(request: NextRequest) {
  const guestId = verifyCartToken(request.cookies.get(CART_COOKIE_NAME)?.value);
  if (!guestId)
    return NextResponse.json(
      { code: "VALIDATION_ERROR", message: "Guest cart not found" },
      { status: 400 },
    );
  const result = await cartService.merge(guestId);
  if (!result.success)
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  const response = NextResponse.json(result.data);
  response.cookies.delete(CART_COOKIE_NAME);
  return response;
}

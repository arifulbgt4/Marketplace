import { NextRequest, NextResponse } from "next/server";
import { cartService } from "src/lib/services/cart";
import {
  CART_COOKIE_MAX_AGE_SECONDS,
  CART_COOKIE_NAME,
  issueCartToken,
  verifyCartToken,
} from "src/lib/cart-identity";

function identity(request: NextRequest) {
  const current = request.cookies.get(CART_COOKIE_NAME)?.value;
  const verified = verifyCartToken(current);
  return verified
    ? { id: verified, value: current!, issued: false }
    : { ...issueCartToken(), issued: true };
}

function responseWithIdentity(
  cartIdentity: ReturnType<typeof identity>,
  data: unknown,
  status = 200,
) {
  const response = NextResponse.json(data, { status });
  if (cartIdentity.issued) {
    response.cookies.set(CART_COOKIE_NAME, cartIdentity.value, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: CART_COOKIE_MAX_AGE_SECONDS,
    });
  }
  return response;
}

export async function GET(request: NextRequest) {
  const cartIdentity = identity(request);
  const result = await cartService.getOrCreate(cartIdentity.id);
  if (!result.success)
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  return responseWithIdentity(cartIdentity, result.data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const cartIdentity = identity(request);
  const result = await cartService.addItem(body, cartIdentity.id);
  if (!result.success)
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  return responseWithIdentity(cartIdentity, result.data, 201);
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const cartIdentity = identity(request);
  const result = await cartService.updateItem(body, cartIdentity.id);
  if (!result.success)
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  return responseWithIdentity(cartIdentity, result.data);
}

export async function DELETE(request: NextRequest) {
  const cartIdentity = identity(request);
  const result = await cartService.clear(cartIdentity.id);
  if (!result.success)
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  return responseWithIdentity(cartIdentity, result.data);
}

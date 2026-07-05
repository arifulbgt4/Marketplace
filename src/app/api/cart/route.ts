import { NextRequest, NextResponse } from "next/server";
import { cartService } from "src/lib/services/cart";

export async function GET() {
  const result = await cartService.getOrCreate();
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await cartService.addItem(body);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const result = await cartService.updateItem(body);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cartId = searchParams.get("cartId");
  if (!cartId) {
    return NextResponse.json({ code: "VALIDATION_ERROR", message: "cartId is required" }, { status: 400 });
  }
  const result = await cartService.clear(cartId);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data);
}

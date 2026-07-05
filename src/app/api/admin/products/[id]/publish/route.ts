import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { productService } = await import("src/lib/services/product");
  const segments = request.nextUrl.pathname.split("/");
  const id = segments[segments.length - 2];
  const result = await productService.publish(id);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data);
}

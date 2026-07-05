import { NextRequest, NextResponse } from "next/server";

const getProductId = (pathname: string): string => {
  const segments = pathname.split("/");
  return segments[segments.length - 2];
};

export async function GET(request: NextRequest) {
  const { productService } = await import("src/lib/services/product");
  const id = getProductId(request.nextUrl.pathname);
  const result = await productService.getById(id);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data);
}

export async function PATCH(request: NextRequest) {
  const { productService } = await import("src/lib/services/product");
  const id = getProductId(request.nextUrl.pathname);
  const body = await request.json();
  const result = await productService.update(id, body);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data);
}

export async function DELETE(request: NextRequest) {
  const { productService } = await import("src/lib/services/product");
  const id = getProductId(request.nextUrl.pathname);
  const result = await productService.archive(id);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data);
}

import { NextRequest, NextResponse } from "next/server";

const getCategoryId = (pathname: string): string => {
  const segments = pathname.split("/");
  return segments[segments.length - 2];
};

export async function GET(request: NextRequest) {
  const { categoryService } = await import("src/lib/services/category");
  const id = getCategoryId(request.nextUrl.pathname);
  const result = await categoryService.getById(id);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data);
}

export async function PATCH(request: NextRequest) {
  const { categoryService } = await import("src/lib/services/category");
  const id = getCategoryId(request.nextUrl.pathname);
  const body = await request.json();
  const result = await categoryService.update(id, body);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data);
}

export async function DELETE(request: NextRequest) {
  const { categoryService } = await import("src/lib/services/category");
  const id = getCategoryId(request.nextUrl.pathname);
  const result = await categoryService.delete(id);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data);
}

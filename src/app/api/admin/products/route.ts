import { NextRequest, NextResponse } from "next/server";
import { productService } from "src/lib/services/product";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const result = await productService.list({
    status: (searchParams.get("status") as any) || undefined,
    categoryId: searchParams.get("categoryId") || undefined,
    search: searchParams.get("search") || undefined,
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 20,
  });
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await productService.create(body);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data, { status: 201 });
}

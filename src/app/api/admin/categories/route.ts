import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "src/lib/services/category";
import { isAppError } from "src/lib/errors";

export async function GET() {
  const result = await categoryService.list(true);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await categoryService.create(body);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data, { status: 201 });
}

import { NextResponse } from "next/server";
import { categoryService } from "src/lib/services/category";

export async function GET() {
  const result = await categoryService.getTree();
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data);
}

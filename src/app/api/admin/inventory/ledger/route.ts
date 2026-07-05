import { NextRequest, NextResponse } from "next/server";
import { inventoryService } from "src/lib/services/inventory";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const variantId = searchParams.get("variantId");
  if (!variantId) {
    return NextResponse.json({ error: "variantId is required" }, { status: 400 });
  }
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 50;
  const result = await inventoryService.getLedger(variantId, page, limit);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data);
}

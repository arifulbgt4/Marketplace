import { NextRequest, NextResponse } from "next/server";
import { inventoryService } from "src/lib/services/inventory";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const lowStock = searchParams.get("lowStock");

  if (lowStock === "true") {
    const result = await inventoryService.getLowStock(productId || undefined);
    if (!result.success) {
      return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
    }
    return NextResponse.json(result.data);
  }

  if (productId) {
    const result = await inventoryService.list(productId);
    if (!result.success) {
      return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
    }
    return NextResponse.json(result.data);
  }

  return NextResponse.json({ error: "Provide productId or lowStock=true" }, { status: 400 });
}

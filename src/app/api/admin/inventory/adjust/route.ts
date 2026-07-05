import { NextRequest, NextResponse } from "next/server";
import { inventoryService } from "src/lib/services/inventory";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await inventoryService.adjust(body.variantId, body.quantity, body.reason);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), { status: result.error.statusCode });
  }
  return NextResponse.json(result.data);
}

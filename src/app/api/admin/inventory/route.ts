import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { inventoryService } from "src/lib/services/inventory";

const querySchema = z.object({
  productId: z.string().uuid().optional(),
  lowStock: z.enum(["true", "false"]).optional(),
});

const PRIVATE_HEADERS = { "Cache-Control": "private, no-store" };

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    productId: searchParams.get("productId") || undefined,
    lowStock: searchParams.get("lowStock") || undefined,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { code: "VALIDATION_ERROR", message: "Invalid inventory query" },
      { status: 400, headers: PRIVATE_HEADERS },
    );
  }
  const { productId, lowStock } = parsed.data;

  if (lowStock === "true") {
    const result = await inventoryService.getLowStock(productId);
    if (!result.success) {
      return NextResponse.json(result.error.toSafeJSON(), {
        status: result.error.statusCode,
        headers: PRIVATE_HEADERS,
      });
    }
    return NextResponse.json(result.data, { headers: PRIVATE_HEADERS });
  }

  if (productId) {
    const result = await inventoryService.list(productId);
    if (!result.success) {
      return NextResponse.json(result.error.toSafeJSON(), {
        status: result.error.statusCode,
        headers: PRIVATE_HEADERS,
      });
    }
    return NextResponse.json(result.data, { headers: PRIVATE_HEADERS });
  }

  return NextResponse.json(
    {
      code: "VALIDATION_ERROR",
      message: "Provide productId or lowStock=true",
    },
    { status: 400, headers: PRIVATE_HEADERS },
  );
}

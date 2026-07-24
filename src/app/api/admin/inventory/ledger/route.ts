import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { inventoryService } from "src/lib/services/inventory";

const querySchema = z.object({
  variantId: z.string().uuid(),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

const PRIVATE_HEADERS = { "Cache-Control": "private, no-store" };

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    variantId: searchParams.get("variantId") || undefined,
    page: searchParams.get("page") || undefined,
    limit: searchParams.get("limit") || undefined,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { code: "VALIDATION_ERROR", message: "Invalid inventory ledger query" },
      { status: 400, headers: PRIVATE_HEADERS },
    );
  }
  const result = await inventoryService.getLedger(
    parsed.data.variantId,
    parsed.data.page,
    parsed.data.limit,
  );
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
      headers: PRIVATE_HEADERS,
    });
  }
  return NextResponse.json(result.data, { headers: PRIVATE_HEADERS });
}

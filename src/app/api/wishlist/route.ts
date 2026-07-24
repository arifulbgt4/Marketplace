import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { wishlistService } from "src/lib/services/wishlist";

const inputSchema = z.object({
  productId: z.string().uuid(),
  wished: z.boolean(),
});

export async function GET(request: NextRequest) {
  const idsOnly = new URL(request.url).searchParams.get("ids") === "true";
  const result = await wishlistService.list(idsOnly);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  }
  return NextResponse.json(result.data, {
    headers: { "cache-control": "private, no-store" },
  });
}

export async function PUT(request: NextRequest) {
  const parsed = inputSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { code: "VALIDATION_ERROR", message: "Invalid wishlist request" },
      { status: 400 },
    );
  }
  const result = await wishlistService.set(
    parsed.data.productId,
    parsed.data.wished,
  );
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  }
  return NextResponse.json(result.data);
}

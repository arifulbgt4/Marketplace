import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { asAppError } from "src/lib/errors";
import { inventoryService } from "src/lib/services/inventory";

const adjustmentSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z
    .number()
    .int()
    .safe()
    .max(1_000_000)
    .min(-1_000_000)
    .refine((value) => value !== 0),
  reason: z.string().trim().min(3).max(500),
});

const PRIVATE_HEADERS = { "Cache-Control": "private, no-store" };

export async function POST(request: NextRequest) {
  try {
    const body = adjustmentSchema.parse(await request.json());
    const result = await inventoryService.adjust(
      body.variantId,
      body.quantity,
      body.reason,
    );
    if (!result.success) {
      return NextResponse.json(result.error.toSafeJSON(), {
        status: result.error.statusCode,
        headers: PRIVATE_HEADERS,
      });
    }
    return NextResponse.json(result.data, { headers: PRIVATE_HEADERS });
  } catch (error: unknown) {
    const appError = asAppError(error);
    return NextResponse.json(appError.toSafeJSON(), {
      status: appError.statusCode,
      headers: PRIVATE_HEADERS,
    });
  }
}

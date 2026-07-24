import { NextRequest, NextResponse } from "next/server";

import { productReviewService } from "src/lib/services/product-review";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: Context) {
  const { id } = await context.params;
  const result = await productReviewService.moderate(
    id,
    await request.json(),
  );
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  }
  return NextResponse.json(result.data);
}

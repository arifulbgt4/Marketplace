import { NextRequest, NextResponse } from "next/server";

import { productReviewService } from "src/lib/services/product-review";

type Context = {
  params: Promise<{ id: string; reviewId: string }>;
};

export async function PATCH(request: NextRequest, context: Context) {
  const { id, reviewId } = await context.params;
  const result = await productReviewService.update(
    id,
    reviewId,
    await request.json(),
  );
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  }
  return NextResponse.json(result.data);
}

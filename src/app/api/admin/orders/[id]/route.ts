import { NextRequest, NextResponse } from "next/server";

import { orderQueryService } from "src/lib/services/order-query";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: Context) {
  const { id } = await context.params;
  const result = await orderQueryService.getAdminOrder(id);
  if (!result.success) {
    return NextResponse.json(result.error.toSafeJSON(), {
      status: result.error.statusCode,
    });
  }
  return NextResponse.json(result.data);
}

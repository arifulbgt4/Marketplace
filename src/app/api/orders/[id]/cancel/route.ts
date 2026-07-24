import { NextRequest, NextResponse } from "next/server";

import { asAppError } from "src/lib/errors";
import { orderCancellationService } from "src/lib/services/order-cancellation";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const result = await orderCancellationService.cancel(
      id,
      await request.json(),
    );
    if (!result.success) {
      return NextResponse.json(result.error.toSafeJSON(), {
        status: result.error.statusCode,
      });
    }
    return NextResponse.json(result.data);
  } catch (error: unknown) {
    const appError = asAppError(error);
    return NextResponse.json(appError.toSafeJSON(), {
      status: appError.statusCode,
    });
  }
}

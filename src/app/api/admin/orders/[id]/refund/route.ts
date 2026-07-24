import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession, requireRole } from "src/lib/authz";
import { ValidationError, asAppError } from "src/lib/errors";
import { paymentRefundService } from "src/lib/services/payment-refund";

type Context = { params: Promise<{ id: string }> };

const refundSchema = z.object({
  amount: z.number().finite().positive(),
  reason: z.string().trim().min(3).max(500),
});

export async function POST(request: NextRequest, context: Context) {
  try {
    const session = await getAuthSession();
    requireRole(session, ["admin", "support"]);
    const idempotencyKey = request.headers.get("idempotency-key")?.trim();
    if (!idempotencyKey || idempotencyKey.length > 200) {
      throw new ValidationError("A valid Idempotency-Key header is required");
    }
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new ValidationError("Invalid JSON request body");
    }
    const input = refundSchema.parse(body);
    const { id } = await context.params;
    const result = await paymentRefundService.refundPayment(
      session!.userId,
      id,
      input.amount,
      input.reason,
      `refund:${id}:${idempotencyKey}`,
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

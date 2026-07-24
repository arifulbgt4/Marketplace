import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession, requireRole } from "src/lib/authz";
import { asAppError, ValidationError } from "src/lib/errors";
import { codCollectionService } from "src/lib/services/cod-collection";

type Context = { params: Promise<{ id: string }> };

const collectionSchema = z.object({
  collectedAmount: z.number().finite().positive().max(999_999_999.99),
  currency: z
    .string()
    .trim()
    .regex(/^[A-Za-z]{3}$/, "Currency must be a 3-letter ISO code")
    .transform((value) => value.toUpperCase()),
  notes: z.string().trim().max(500).optional(),
  receiptRef: z.string().trim().max(120).optional(),
});

const idempotencyKeySchema = z
  .string()
  .trim()
  .min(8)
  .max(200)
  .regex(/^[A-Za-z0-9:_-]+$/);

const privateJsonHeaders = {
  "Cache-Control": "private, no-store",
};

export async function POST(request: NextRequest, context: Context) {
  try {
    const session = await getAuthSession();
    requireRole(session, ["admin", "support"]);

    const { id } = await context.params;
    const body = collectionSchema.parse(await request.json());
    const rawIdempotencyKey = request.headers.get("idempotency-key");
    if (!rawIdempotencyKey) {
      throw new ValidationError("Idempotency-Key header is required");
    }
    const idempotencyKey = idempotencyKeySchema.parse(rawIdempotencyKey);

    const result = await codCollectionService.collectPayment(session!.userId, {
      orderId: id,
      collectedAmount: body.collectedAmount,
      currency: body.currency,
      notes: body.notes,
      receiptRef: body.receiptRef,
      idempotencyKey,
    });

    if (!result.success) {
      return NextResponse.json(result.error.toSafeJSON(), {
        status: result.error.statusCode,
        headers: privateJsonHeaders,
      });
    }

    return NextResponse.json(result.data, {
      status: 200,
      headers: privateJsonHeaders,
    });
  } catch (error: unknown) {
    const appError = asAppError(error);
    return NextResponse.json(appError.toSafeJSON(), {
      status: appError.statusCode,
      headers: privateJsonHeaders,
    });
  }
}

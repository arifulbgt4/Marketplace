import { FulfillmentStatus, OrderStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAuthSession, requireRole } from "src/lib/authz";
import { asAppError } from "src/lib/errors";
import { orderTransitionService } from "src/lib/services/order-transition";

const transitionRequestSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("ORDER"),
    status: z.nativeEnum(OrderStatus),
    reason: z.string().trim().min(3).max(500),
    expectedVersion: z.number().int().min(0),
  }),
  z.object({
    kind: z.literal("FULFILLMENT"),
    status: z.nativeEnum(FulfillmentStatus),
    reason: z.string().trim().min(3).max(500),
    expectedVersion: z.number().int().min(0),
  }),
]);

type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: Context) {
  try {
    const session = await getAuthSession();
    requireRole(session, ["admin", "support"]);
    const { id } = await context.params;
    const input = transitionRequestSchema.parse(await request.json());
    const result =
      input.kind === "ORDER"
        ? await orderTransitionService.transitionOrder({
            orderId: id,
            toStatus: input.status,
            expectedVersion: input.expectedVersion,
            actorId: session!.userId,
            reason: input.reason,
          })
        : await orderTransitionService.transitionFulfillment({
            orderId: id,
            toStatus: input.status,
            expectedVersion: input.expectedVersion,
            actorId: session!.userId,
            reason: input.reason,
          });

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

import { NextRequest, NextResponse } from "next/server";

import { getAuthSession } from "src/lib/authz";
import { asAppError } from "src/lib/errors";
import { shipmentService } from "src/lib/services/shipment";
import { shipmentCreateSchema } from "src/modules/order";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: Context) {
  try {
    const session = await getAuthSession();
    const { id } = await context.params;
    const input = shipmentCreateSchema.parse(await request.json());
    const result = await shipmentService.create(session, id, input);

    if (!result.success) {
      return NextResponse.json(result.error.toSafeJSON(), {
        status: result.error.statusCode,
      });
    }
    return NextResponse.json(result.data, { status: 201 });
  } catch (error: unknown) {
    const appError = asAppError(error);
    return NextResponse.json(appError.toSafeJSON(), {
      status: appError.statusCode,
    });
  }
}

import { NextRequest, NextResponse } from "next/server";

import { getAuthSession } from "src/lib/authz";
import { asAppError } from "src/lib/errors";
import { shipmentService } from "src/lib/services/shipment";
import { shipmentUpdateSchema } from "src/modules/order";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const session = await getAuthSession();
    const { id } = await context.params;
    const input = shipmentUpdateSchema.parse(await request.json());
    const result = await shipmentService.update(session, id, input);

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

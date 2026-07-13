import { NextRequest, NextResponse } from "next/server";
import { checkoutCoordinator } from "src/lib/services/checkout";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const result = await checkoutCoordinator.getPaymentMethods(id);
    if (!result.success) {
      return NextResponse.json(result.error.toSafeJSON(), {
        status: result.error.statusCode,
      });
    }
    return NextResponse.json(result.data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

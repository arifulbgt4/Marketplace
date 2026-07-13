import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "src/lib/authz";
import { codCollectionService } from "src/lib/services/cod-collection";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: Context) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json(
        { code: "AUTHENTICATION_ERROR", message: "Authentication required" },
        { status: 401 }
      );
    }

    if (!["admin", "support"].includes(session.role)) {
      return NextResponse.json(
        { code: "FORBIDDEN", message: "Access denied" },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    const result = await codCollectionService.collectPayment(session.userId, {
      orderId: id,
      collectedAmount: Number(body.collectedAmount),
      currency: body.currency || "USD",
      notes: body.notes,
      receiptRef: body.receiptRef,
    });

    if (!result.success) {
      return NextResponse.json(result.error.toSafeJSON(), {
        status: result.error.statusCode,
      });
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error: any) {
    console.error("Admin order collection route failure:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

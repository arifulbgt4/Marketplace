import { NextRequest, NextResponse } from "next/server";
import { paymentRegistry } from "src/lib/services/payment-adapter";
import { paymentReconciliationService } from "src/lib/services/payment-reconciliation";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const headers: Record<string, string> = {};
    request.headers.forEach((val, key) => {
      headers[key] = val;
    });

    // Detect provider from headers or query params
    const provider = request.nextUrl.searchParams.get("provider") || "MOCK";

    const adapter = paymentRegistry.getAdapter(provider);
    const webhookResult = await adapter.handleWebhook(rawBody, headers);

    if (!webhookResult.success) {
      return NextResponse.json(webhookResult.error.toSafeJSON(), {
        status: webhookResult.error.statusCode,
      });
    }

    const { providerRef, status, rawResponse } = webhookResult.data;

    // Map webhook status (PENDING, PAID, FAILED) to database PaymentStatus
    let dbStatus = "PENDING";
    if (status === "PAID") {
      dbStatus = "PAID";
    } else if (status === "FAILED") {
      dbStatus = "FAILED";
    }

    const reconcileResult = await paymentReconciliationService.reconcilePayment(
      providerRef,
      dbStatus as any,
      rawResponse
    );

    if (!reconcileResult.success) {
      return NextResponse.json(reconcileResult.error.toSafeJSON(), {
        status: reconcileResult.error.statusCode,
      });
    }

    return NextResponse.json(reconcileResult.data, { status: 200 });
  } catch (error: any) {
    console.error("Webhook endpoint failure:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

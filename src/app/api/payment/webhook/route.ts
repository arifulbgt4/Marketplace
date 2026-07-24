import { PaymentStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { AppError, ErrorCode, asAppError } from "src/lib/errors";
import { paymentRegistry } from "src/lib/services/payment-adapter";
import { paymentReconciliationService } from "src/lib/services/payment-reconciliation";

const MAX_PAYMENT_WEBHOOK_BYTES = 64 * 1024;
const NO_STORE_HEADERS = { "Cache-Control": "private, no-store" };

export async function POST(request: NextRequest) {
  try {
    const contentLength = Number(request.headers.get("content-length"));
    if (
      Number.isFinite(contentLength) &&
      contentLength > MAX_PAYMENT_WEBHOOK_BYTES
    ) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        "Webhook payload is too large",
        413,
      );
    }
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, "utf8") > MAX_PAYMENT_WEBHOOK_BYTES) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        "Webhook payload is too large",
        413,
      );
    }
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });
    const provider = request.nextUrl.searchParams.get("provider") ?? "MOCK";
    const adapter = paymentRegistry.getAdapter(provider);
    const webhookResult = await adapter.handleWebhook(rawBody, headers);
    if (!webhookResult.success) {
      return NextResponse.json(webhookResult.error.toSafeJSON(), {
        status: webhookResult.error.statusCode,
        headers: NO_STORE_HEADERS,
      });
    }

    const { eventId, providerRef, status, rawResponse } = webhookResult.data;
    const reconcileResult = await paymentReconciliationService.reconcilePayment(
      providerRef,
      PaymentStatus[status],
      rawResponse,
      `webhook:${provider.toUpperCase()}:${eventId}`,
    );
    if (!reconcileResult.success) {
      return NextResponse.json(reconcileResult.error.toSafeJSON(), {
        status: reconcileResult.error.statusCode,
        headers: NO_STORE_HEADERS,
      });
    }
    return NextResponse.json(reconcileResult.data, {
      headers: NO_STORE_HEADERS,
    });
  } catch (error: unknown) {
    const appError = asAppError(error);
    return NextResponse.json(appError.toSafeJSON(), {
      status: appError.statusCode,
      headers: NO_STORE_HEADERS,
    });
  }
}

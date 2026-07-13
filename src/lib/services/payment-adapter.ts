import { ok, fail, type Result } from "src/lib/errors";

export interface PaymentIntentInput {
  orderId: string;
  amount: number;
  currency: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntentResult {
  providerRef: string;
  clientSecret?: string;
  status: "PENDING" | "PAID" | "FAILED";
  rawResponse: Record<string, any>;
}

export interface PaymentVerificationResult {
  providerRef: string;
  amount: number;
  status: "PAID" | "FAILED" | "PENDING";
  rawResponse: Record<string, any>;
}

export interface RefundResult {
  refundRef: string;
  amount: number;
  status: "REFUNDED" | "FAILED";
  rawResponse: Record<string, any>;
}

export interface PaymentAdapter {
  createIntent(input: PaymentIntentInput): Promise<Result<PaymentIntentResult>>;
  verifyTransaction(providerRef: string): Promise<Result<PaymentVerificationResult>>;
  processRefund(providerRef: string, amount: number): Promise<Result<RefundResult>>;
  handleWebhook(
    rawBody: string,
    headers: Record<string, string>
  ): Promise<Result<{
    event: string;
    providerRef: string;
    amount: number;
    status: "PAID" | "FAILED" | "PENDING";
    rawResponse: Record<string, any>;
  }>>;
}

export class MockPaymentAdapter implements PaymentAdapter {
  async createIntent(input: PaymentIntentInput): Promise<Result<PaymentIntentResult>> {
    const mockRef = `mock_intent_${Math.random().toString(36).substring(7)}`;
    return ok({
      providerRef: mockRef,
      clientSecret: `mock_secret_${mockRef}`,
      status: "PENDING",
      rawResponse: { mock: true, input },
    });
  }

  async verifyTransaction(providerRef: string): Promise<Result<PaymentVerificationResult>> {
    if (providerRef.includes("fail")) {
      return ok({
        providerRef,
        amount: 100,
        status: "FAILED",
        rawResponse: { mock: true, error: "Mock failure transaction" },
      });
    }
    return ok({
      providerRef,
      amount: 100,
      status: "PAID",
      rawResponse: { mock: true, success: true },
    });
  }

  async processRefund(providerRef: string, amount: number): Promise<Result<RefundResult>> {
    const refundRef = `mock_refund_${Math.random().toString(36).substring(7)}`;
    return ok({
      refundRef,
      amount,
      status: "REFUNDED",
      rawResponse: { mock: true, providerRef },
    });
  }

  async handleWebhook(
    rawBody: string,
    headers: Record<string, string>
  ): Promise<Result<{
    event: string;
    providerRef: string;
    amount: number;
    status: "PAID" | "FAILED" | "PENDING";
    rawResponse: Record<string, any>;
  }>> {
    try {
      const payload = JSON.parse(rawBody);
      const providerRef = payload.providerRef || `mock_webhook_${Date.now()}`;
      const amount = payload.amount || 0;
      const status = payload.status || "PAID";
      return ok({
        event: payload.event || "payment.success",
        providerRef,
        amount,
        status,
        rawResponse: payload,
      });
    } catch (e: any) {
      return fail(e);
    }
  }
}

export class PaymentRegistry {
  private adapters: Map<string, PaymentAdapter> = new Map();

  constructor() {
    const mockAdapter = new MockPaymentAdapter();
    this.adapters.set("CASH_ON_DELIVERY", mockAdapter);
    this.adapters.set("MOCK", mockAdapter);
  }

  getAdapter(provider: string): PaymentAdapter {
    const adapter = this.adapters.get(provider.toUpperCase());
    if (!adapter) {
      throw new Error(`Unsupported payment provider: ${provider}`);
    }
    return adapter;
  }
}

export const paymentRegistry = new PaymentRegistry();

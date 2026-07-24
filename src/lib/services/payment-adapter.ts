import { createHash, createHmac, randomUUID, timingSafeEqual } from "crypto";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

import {
  AppError,
  AuthenticationError,
  BusinessRuleError,
  ErrorCode,
  ValidationError,
  asAppError,
  fail,
  ok,
  type Result,
} from "src/lib/errors";

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
  rawResponse: Record<string, unknown>;
}

export interface PaymentVerificationResult {
  providerRef: string;
  amount: number;
  status: "PAID" | "FAILED" | "PENDING";
  rawResponse: Record<string, unknown>;
}

export interface RefundResult {
  refundRef: string;
  amount: number;
  status: "REFUNDED" | "FAILED";
  rawResponse: Record<string, unknown>;
}

export interface PaymentWebhookResult {
  eventId: string;
  event: string;
  providerRef: string;
  amount: number;
  status: "PAID" | "FAILED" | "PENDING";
  rawResponse: Prisma.InputJsonObject;
}

export interface PaymentAdapter {
  createIntent(input: PaymentIntentInput): Promise<Result<PaymentIntentResult>>;
  verifyTransaction(
    providerRef: string,
  ): Promise<Result<PaymentVerificationResult>>;
  processRefund(
    providerRef: string,
    amount: number,
  ): Promise<Result<RefundResult>>;
  handleWebhook(
    rawBody: string,
    headers: Record<string, string>,
  ): Promise<Result<PaymentWebhookResult>>;
}

const mockWebhookSchema = z.object({
  eventId: z.string().trim().min(1).max(200),
  event: z.string().trim().min(1).max(200).default("payment.status.changed"),
  providerRef: z.string().trim().min(1).max(200),
  amount: z.number().finite().nonnegative(),
  status: z.enum(["PENDING", "PAID", "FAILED"]),
});

type SecretProvider = () => string | undefined;

export function signMockWebhook(rawBody: string, secret: string): string {
  return `sha256=${createHmac("sha256", secret).update(rawBody).digest("hex")}`;
}

function validSignature(
  rawBody: string,
  provided: string | undefined,
  secret: string,
): boolean {
  if (!provided) return false;
  const expected = signMockWebhook(rawBody, secret);
  const normalized = provided.startsWith("sha256=")
    ? provided
    : `sha256=${provided}`;
  const expectedDigest = createHash("sha256").update(expected).digest();
  const providedDigest = createHash("sha256").update(normalized).digest();
  return timingSafeEqual(expectedDigest, providedDigest);
}

export class MockPaymentAdapter implements PaymentAdapter {
  constructor(
    private readonly secretProvider: SecretProvider = () =>
      process.env.MOCK_PAYMENT_WEBHOOK_SECRET,
  ) {}

  async createIntent(
    input: PaymentIntentInput,
  ): Promise<Result<PaymentIntentResult>> {
    const mockRef = `mock_intent_${randomUUID()}`;
    return ok({
      providerRef: mockRef,
      clientSecret: `mock_secret_${mockRef}`,
      status: "PENDING",
      rawResponse: { mock: true, input },
    });
  }

  async verifyTransaction(
    providerRef: string,
  ): Promise<Result<PaymentVerificationResult>> {
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

  async processRefund(
    providerRef: string,
    amount: number,
  ): Promise<Result<RefundResult>> {
    if (!Number.isFinite(amount) || amount <= 0) {
      return fail(new BusinessRuleError("Refund amount must be positive"));
    }
    return ok({
      refundRef: `mock_refund_${randomUUID()}`,
      amount,
      status: "REFUNDED",
      rawResponse: { mock: true, providerRef },
    });
  }

  async handleWebhook(
    rawBody: string,
    headers: Record<string, string>,
  ): Promise<Result<PaymentWebhookResult>> {
    try {
      const secret = this.secretProvider();
      if (!secret || secret.length < 32) {
        throw new AppError(
          ErrorCode.INTERNAL_ERROR,
          "Payment webhook is not configured",
          503,
        );
      }
      if (
        !validSignature(
          rawBody,
          headers["x-mock-signature"] ?? headers["X-Mock-Signature"],
          secret,
        )
      ) {
        throw new AuthenticationError("Invalid webhook signature");
      }
      let json: unknown;
      try {
        json = JSON.parse(rawBody);
      } catch {
        throw new ValidationError("Invalid webhook payload");
      }
      const payload = mockWebhookSchema.parse(json);
      return ok({
        ...payload,
        rawResponse: payload,
      });
    } catch (error: unknown) {
      return fail(asAppError(error));
    }
  }
}

export class PaymentRegistry {
  private adapters: Map<string, PaymentAdapter> = new Map();

  constructor(mockAdapter: PaymentAdapter = new MockPaymentAdapter()) {
    this.adapters.set("CASH_ON_DELIVERY", mockAdapter);
    this.adapters.set("MOCK", mockAdapter);
  }

  getAdapter(provider: string): PaymentAdapter {
    const adapter = this.adapters.get(provider.toUpperCase());
    if (!adapter) {
      throw new BusinessRuleError("Unsupported payment provider");
    }
    return adapter;
  }
}

export const paymentRegistry = new PaymentRegistry();

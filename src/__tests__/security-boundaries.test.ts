import { afterEach, describe, expect, it, vi } from "vitest";
import { classifyRoute } from "src/lib/route-access";
import { issueCartToken, verifyCartToken } from "src/lib/cart-identity";
import { Money } from "src/lib/money";
import { couponSchema } from "src/lib/checkout";
import { envSchema } from "src/lib/env";
import { accountNotificationService } from "src/lib/services/account-notification";

afterEach(() => vi.unstubAllEnvs());

describe("route access table", () => {
  it.each([
    ["/", "public"],
    ["/l", "public"],
    ["/l/house-1", "public"],
    ["/l/create", "public"],
    ["/l/edit/house-1", "public"],
    ["/merchant/legacy-host", "public"],
    ["/products/item-1", "public"],
    ["/cart", "public"],
    ["/forgot-password", "public"],
    ["/verify-email", "public"],
    ["/checkout", "customer"],
    ["/u/account", "customer"],
    ["/admin/products", "catalog"],
    ["/admin/orders", "operations"],
    ["/admin/orders/order-1", "operations"],
    ["/admin/returns/return-1", "operations"],
    ["/admin/support", "operations"],
    ["/admin/support/request-1", "operations"],
    ["/admin/coupons", "admin"],
  ] as const)("classifies %s as %s", (pathname, access) => {
    expect(classifyRoute(pathname)).toBe(access);
  });
});

describe("signed guest cart identity", () => {
  const secret = "a-secure-test-secret-that-is-over-32-characters";

  it("round-trips a signed identity", () => {
    const token = issueCartToken(secret);
    expect(verifyCartToken(token.value, secret)).toBe(token.id);
  });

  it("rejects a modified identity or signature", () => {
    const token = issueCartToken(secret);
    expect(verifyCartToken(`x${token.value}`, secret)).toBeNull();
    expect(verifyCartToken(`${token.value}x`, secret)).toBeNull();
  });
});

describe("financial and coupon boundaries", () => {
  it("keeps repeated decimal additions exact in minor units", () => {
    const total = Money.fromDecimal(0.1).add(Money.fromDecimal(0.2));
    expect(total.toMinorUnits()).toBe(30);
    expect(total.amount).toBe(0.3);
  });

  it("rejects percentage coupons over 100 percent", () => {
    expect(
      couponSchema.safeParse({
        code: "TOO_MUCH",
        discountType: "percentage",
        discountValue: 101,
      }).success,
    ).toBe(false);
  });

  it("requires IDs for scoped coupons", () => {
    expect(
      couponSchema.safeParse({
        code: "PRODUCT_ONLY",
        discountType: "fixed",
        discountValue: 5,
        scope: "product",
      }).success,
    ).toBe(false);
  });
});

describe("environment and account notification boundaries", () => {
  const requiredEnvironment = {
    NEXTAUTH_SECRET: "a-test-secret-with-at-least-thirty-two-characters",
    NEXTAUTH_URL: "http://localhost:3000",
    POSTGRES_PRISMA_URL: "postgresql://user:password@localhost:5432/database",
    POSTGRES_URL_NON_POOLING:
      "postgresql://user:password@localhost:5432/database",
    NEXT_PUBLIC_MARKETPLACE_NAME: "Marketplace",
    NEXT_PUBLIC_DOMAIN_URL: "http://localhost:3000",
  };

  it("accepts the required environment without optional SMTP", () => {
    expect(envSchema.safeParse(requiredEnvironment).success).toBe(true);
  });

  it("rejects a partial SMTP configuration", () => {
    expect(
      envSchema.safeParse({
        ...requiredEnvironment,
        SMTP_HOST: "smtp.example.com",
      }).success,
    ).toBe(false);
  });

  it("validates internal outbox worker secrets and batch bounds", () => {
    expect(
      envSchema.safeParse({
        ...requiredEnvironment,
        OUTBOX_WORKER_SECRET: "too-short",
      }).success,
    ).toBe(false);
    expect(
      envSchema.safeParse({
        ...requiredEnvironment,
        OUTBOX_WORKER_SECRET:
          "outbox-worker-secret-with-at-least-32-characters",
        OUTBOX_WORKER_BATCH_SIZE: 101,
      }).success,
    ).toBe(false);
  });

  it("treats an empty mock webhook secret as disabled and rejects weak secrets", () => {
    expect(
      envSchema.safeParse({
        ...requiredEnvironment,
        MOCK_PAYMENT_WEBHOOK_SECRET: "",
      }).success,
    ).toBe(true);
    expect(
      envSchema.safeParse({
        ...requiredEnvironment,
        MOCK_PAYMENT_WEBHOOK_SECRET: "too-short",
      }).success,
    ).toBe(false);
  });

  it("returns a development preview without logging or sending a token", async () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("NEXTAUTH_URL", "http://localhost:3000");
    vi.stubEnv("SMTP_HOST", "");
    vi.stubEnv("SMTP_USER", "");
    vi.stubEnv("SMTP_PASSWORD", "");
    vi.stubEnv("SMTP_FROM", "");
    const result = await accountNotificationService.sendVerification(
      "customer@example.com",
      "a".repeat(64),
    );
    expect(result.delivered).toBe(false);
    expect(result.previewUrl).toContain("/api/account/verification/confirm");
  });
});

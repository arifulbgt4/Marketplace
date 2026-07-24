import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  rateLimit,
  rateLimitStoreSizeForTests,
  requestRateLimitIdentity,
  resetRateLimitStoreForTests,
} from "src/lib/rate-limit";

const reportingMocks = vi.hoisted(() => ({
  getAuthSession: vi.fn(),
  requireRole: vi.fn(),
  inventoryFindMany: vi.fn(),
  inventoryLedgerFindMany: vi.fn(),
  inventoryLedgerCount: vi.fn(),
  deliveryZoneFindMany: vi.fn(),
  orderFindMany: vi.fn(),
  paymentFindMany: vi.fn(),
}));

vi.mock("src/lib/authz", async (importOriginal) => {
  const actual = await importOriginal<typeof import("src/lib/authz")>();
  return {
    ...actual,
    getAuthSession: reportingMocks.getAuthSession,
    requireRole: reportingMocks.requireRole,
  };
});

vi.mock("src/lib/prisma", () => ({
  prisma: {
    inventory: { findMany: reportingMocks.inventoryFindMany },
    inventoryLedger: {
      findMany: reportingMocks.inventoryLedgerFindMany,
      count: reportingMocks.inventoryLedgerCount,
    },
    deliveryZone: { findMany: reportingMocks.deliveryZoneFindMany },
    order: { findMany: reportingMocks.orderFindMany },
    payment: { findMany: reportingMocks.paymentFindMany },
  },
}));

import { POST as paymentWebhook } from "src/app/api/payment/webhook/route";
import { POST as validateCoupon } from "src/app/api/coupon/validate/route";
import {
  adminReportingService,
  MAX_REPORT_ROWS,
} from "src/lib/services/admin-reporting";
import { inventoryService } from "src/lib/services/inventory";
import { deliveryService } from "src/lib/services/delivery";

describe("Phase 9 security and performance controls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRateLimitStoreForTests();
    reportingMocks.getAuthSession.mockResolvedValue({
      userId: "admin-1",
      role: "admin",
    });
    reportingMocks.inventoryFindMany.mockResolvedValue([]);
    reportingMocks.inventoryLedgerFindMany.mockResolvedValue([]);
    reportingMocks.inventoryLedgerCount.mockResolvedValue(0);
    reportingMocks.deliveryZoneFindMany.mockResolvedValue([]);
    reportingMocks.orderFindMany.mockResolvedValue([]);
    reportingMocks.paymentFindMany.mockResolvedValue([]);
  });

  it("keeps the in-process rate-limit store bounded and hashes client identity", () => {
    for (let index = 0; index < 10_050; index += 1) {
      rateLimit(`identity-${index}`, {
        maxRequests: 1,
        windowMs: 60_000,
      });
    }

    const identity = requestRateLimitIdentity(
      new Headers({ "x-forwarded-for": "203.0.113.8, 10.0.0.1" }),
    );

    expect(rateLimitStoreSizeForTests()).toBeLessThanOrEqual(10_000);
    expect(identity).toMatch(/^[a-f0-9]{64}$/);
    expect(identity).not.toContain("203.0.113.8");
  });

  it("rejects an oversized payment webhook before adapter processing", async () => {
    const response = await paymentWebhook(
      new NextRequest("http://localhost/api/payment/webhook?provider=MOCK", {
        method: "POST",
        headers: { "content-length": String(65 * 1024) },
        body: "{}",
      }),
    );

    expect(response.status).toBe(413);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(await response.json()).toMatchObject({
      code: "VALIDATION_ERROR",
      message: "Webhook payload is too large",
    });
  });

  it.each([
    ["inventory", "inventoryFindMany"],
    ["orders", "orderFindMany"],
    ["payments", "paymentFindMany"],
  ] as const)(
    "caps the %s report query and exposes truncation metadata",
    async (type, mockName) => {
      const queryMock = reportingMocks[mockName];
      queryMock.mockResolvedValue([]);

      const result = await adminReportingService.report({
        type,
        currency: "USD",
      });

      expect(result.success).toBe(true);
      expect(queryMock).toHaveBeenCalledWith(
        expect.objectContaining({ take: MAX_REPORT_ROWS + 1 }),
      );
      if (result.success) {
        expect(result.data).toMatchObject({ truncated: false });
      }
    },
  );

  it("caps inventory ledger and low-stock queries from oversized input", async () => {
    const ledger = await inventoryService.getLedger("variant-1", -10, 100_000);
    const lowStock = await inventoryService.getLowStock();

    expect(ledger.success).toBe(true);
    expect(lowStock.success).toBe(true);
    expect(reportingMocks.inventoryLedgerFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 100 }),
    );
    expect(reportingMocks.inventoryFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 1_000,
        orderBy: [{ onHand: "asc" }, { variantId: "asc" }],
      }),
    );
  });

  it("bounds delivery-zone queries and rejects oversized coupon scope input", async () => {
    const zones = await deliveryService.getActiveZones();
    const quote = await deliveryService.getShippingQuote(100, "BD", "BDT");
    const productIds = Array.from(
      { length: 101 },
      () => "123e4567-e89b-12d3-a456-426614174000",
    );
    const response = await validateCoupon(
      new NextRequest("http://localhost/api/coupon/validate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          code: "SAVE10",
          subtotal: 100,
          productIds,
          categoryIds: [],
        }),
      }),
    );

    expect(zones.success).toBe(true);
    expect(quote.success).toBe(true);
    expect(reportingMocks.deliveryZoneFindMany).toHaveBeenCalledTimes(2);
    for (const [query] of reportingMocks.deliveryZoneFindMany.mock.calls) {
      expect(query).toMatchObject({
        take: 100,
        orderBy: [{ priority: "asc" }, { id: "asc" }],
        include: {
          methods: {
            take: 50,
            orderBy: { id: "asc" },
          },
        },
      });
    }
    expect(response.status).toBe(400);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });
});

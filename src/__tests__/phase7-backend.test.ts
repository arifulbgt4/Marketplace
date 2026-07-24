import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET as getAdminCustomers } from "src/app/api/admin/customers/route";
import { GET as getStorefrontSettings } from "src/app/api/storefront/settings/route";
import { getAuthSession } from "src/lib/authz";
import { adminDashboardService } from "src/lib/services/admin-dashboard";
import { businessSettingsService } from "src/lib/services/business-settings";
import { customerAdminService } from "src/lib/services/customer-admin";

const mockPrisma = vi.hoisted(() => ({
  order: {
    count: vi.fn(),
    groupBy: vi.fn(),
  },
  payment: {
    aggregate: vi.fn(),
    findMany: vi.fn(),
  },
  user: {
    count: vi.fn(),
    findMany: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
  },
  inventory: {
    findMany: vi.fn(),
  },
  businessSettings: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    upsert: vi.fn(),
  },
  auditLog: {
    create: vi.fn(),
  },
  $queryRaw: vi.fn(),
  $transaction: vi.fn(),
}));

vi.mock("src/lib/prisma", () => ({
  prisma: mockPrisma,
}));

vi.mock("src/lib/authz", async (importOriginal) => {
  const actual = await importOriginal<typeof import("src/lib/authz")>();
  return {
    ...actual,
    getAuthSession: vi.fn(),
  };
});

const adminSession = {
  userId: "admin-1",
  sessionId: "session-1",
  role: "admin" as const,
  accountStatus: "active" as const,
  permissions: [],
  isSystem: false,
  createdAt: new Date("2026-07-24T00:00:00.000Z"),
  expiresAt: new Date("2026-07-25T00:00:00.000Z"),
};

const supportSession = {
  ...adminSession,
  userId: "support-1",
  role: "support" as const,
};

const customerRecord = {
  id: "customer-1",
  name: "Customer One",
  email: "customer@example.com",
  phone: null,
  image: null,
  status: "active",
  createdAt: new Date("2026-07-01T00:00:00.000Z"),
  updatedAt: new Date("2026-07-01T00:00:00.000Z"),
  _count: { orders: 2 },
};

describe("Phase 7 backend foundation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma.$transaction.mockImplementation(
      (
        operation:
          | Promise<unknown>[]
          | ((client: typeof mockPrisma) => Promise<unknown>),
      ) =>
        Array.isArray(operation)
          ? Promise.all(operation)
          : operation(mockPrisma),
    );
  });

  it("returns currency-scoped real dashboard KPIs and net partial refunds", async () => {
    vi.mocked(getAuthSession).mockResolvedValue(adminSession);
    mockPrisma.order.count.mockResolvedValue(3);
    mockPrisma.order.groupBy.mockResolvedValue([
      { status: "confirmed", _count: { _all: 2 } },
      { status: "cancelled", _count: { _all: 1 } },
    ]);
    mockPrisma.payment.aggregate
      .mockResolvedValueOnce({
        _sum: { amount: new Prisma.Decimal("100") },
      })
      .mockResolvedValueOnce({
        _sum: {
          amount: new Prisma.Decimal("50"),
          refundedAmount: new Prisma.Decimal("10"),
        },
      });
    mockPrisma.user.count.mockResolvedValueOnce(20).mockResolvedValueOnce(4);
    mockPrisma.$queryRaw.mockResolvedValue([
      { lowStockVariants: BigInt(1), availableUnits: BigInt(3) },
    ]);

    const result = await adminDashboardService.getMetrics({
      dateFrom: "2026-07-01",
      dateTo: "2026-07-31",
      currency: "usd",
    });

    expect(result.success).toBe(true);
    expect(mockPrisma.order.count).toHaveBeenCalledWith({
      where: {
        placedAt: {
          not: null,
          gte: new Date("2026-07-01T00:00:00.000Z"),
          lte: new Date("2026-07-31T23:59:59.999Z"),
        },
        currency: "USD",
      },
    });
    if (result.success) {
      expect(result.data).toMatchObject({
        orders: {
          total: 3,
          byStatus: {
            pending: 0,
            confirmed: 2,
            cancelled: 1,
            completed: 0,
          },
        },
        revenue: { netCollected: "140", currency: "USD" },
        customers: { total: 20, newInRange: 4 },
        inventory: { lowStockVariants: 1, availableUnits: 3 },
      });
    }
    expect(mockPrisma.payment.findMany).not.toHaveBeenCalled();
    expect(mockPrisma.$queryRaw).toHaveBeenCalledTimes(1);
  });

  it("allows support to read customers but not change account status", async () => {
    vi.mocked(getAuthSession).mockResolvedValue(supportSession);
    mockPrisma.user.findMany.mockResolvedValue([customerRecord]);
    mockPrisma.user.count.mockResolvedValue(1);

    const list = await customerAdminService.list({});
    const update = await customerAdminService.updateStatus("customer-1", {
      status: "suspended",
      reason: "Confirmed abuse",
    });

    expect(list.success).toBe(true);
    expect(update.success).toBe(false);
    if (!update.success) expect(update.error.statusCode).toBe(403);
    expect(mockPrisma.user.update).not.toHaveBeenCalled();

    const response = await getAdminCustomers(
      new NextRequest("http://localhost/api/admin/customers"),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });

  it("invalidates sessions and audits an admin customer suspension", async () => {
    vi.mocked(getAuthSession).mockResolvedValue(adminSession);
    mockPrisma.user.findFirst.mockResolvedValue({
      id: "customer-1",
      status: "active",
    });
    mockPrisma.user.update.mockResolvedValue({
      ...customerRecord,
      status: "suspended",
    });
    mockPrisma.auditLog.create.mockResolvedValue({ id: "audit-1" });

    const result = await customerAdminService.updateStatus("customer-1", {
      status: "suspended",
      reason: "Confirmed abuse",
    });

    expect(result.success).toBe(true);
    expect(mockPrisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          status: "suspended",
          sessionVersion: { increment: 1 },
        },
      }),
    );
    expect(mockPrisma.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        actorId: "admin-1",
        action: "user.suspend",
        targetId: "customer-1",
        metadata: expect.objectContaining({
          statusFrom: "active",
          statusTo: "suspended",
          sessionsInvalidated: true,
        }),
      }),
    });
  });

  it("rejects secret-like fields from payment settings", async () => {
    vi.mocked(getAuthSession).mockResolvedValue(adminSession);
    mockPrisma.businessSettings.findUnique.mockResolvedValue(null);

    const result = await businessSettingsService.update("payments", {
      onlinePayment: {
        enabled: true,
        apiKey: "must-not-be-stored",
      },
    });

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.statusCode).toBe(400);
    expect(mockPrisma.businessSettings.upsert).not.toHaveBeenCalled();
    expect(mockPrisma.auditLog.create).not.toHaveBeenCalled();
  });

  it("rejects executable branding URLs", async () => {
    vi.mocked(getAuthSession).mockResolvedValue(adminSession);
    mockPrisma.businessSettings.findUnique.mockResolvedValue(null);

    const result = await businessSettingsService.update("branding", {
      logoUrl: "javascript:alert(1)",
    });

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.statusCode).toBe(400);
    expect(mockPrisma.businessSettings.upsert).not.toHaveBeenCalled();
  });

  it("projects only allow-listed business fields to the storefront", async () => {
    mockPrisma.businessSettings.findMany.mockResolvedValue([
      {
        key: "business",
        value: {
          displayName: "Acme Shop",
          legalName: "Acme Holdings Limited",
          supportEmail: "help@example.com",
          supportPhone: null,
          address: null,
          defaultCurrency: "BDT",
          defaultLocale: "bn",
          timezone: "Asia/Dhaka",
        },
      },
      {
        key: "branding",
        value: {
          logoUrl: null,
          faviconUrl: null,
          primaryColor: "#123456",
          secondaryColor: "#654321",
          seoTitle: null,
          seoDescription: null,
          socialLinks: {},
        },
      },
      {
        key: "payment_methods",
        value: {
          cashOnDelivery: {
            enabled: true,
            label: "Cash on Delivery",
            description: null,
          },
          onlinePayment: {
            enabled: false,
            label: "Online Payment",
            description: null,
            provider: null,
          },
        },
      },
    ]);

    const result = await businessSettingsService.getPublic();

    expect(result.business).toMatchObject({
      displayName: "Acme Shop",
      defaultCurrency: "BDT",
      defaultLocale: "bn",
    });
    expect(result.business).not.toHaveProperty("legalName");
    expect(JSON.stringify(result)).not.toMatch(
      /apiKey|secret|token|credential/i,
    );

    const response = await getStorefrontSettings();
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("s-maxage=60");
  });
});

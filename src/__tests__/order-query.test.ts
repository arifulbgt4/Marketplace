import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getAuthSession } from "src/lib/authz";
import { orderQueryService } from "src/lib/services/order-query";

const mockPrisma = vi.hoisted(() => ({
  order: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    count: vi.fn(),
  },
  auditLog: {
    findMany: vi.fn(),
  },
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

const customerSession = {
  ...adminSession,
  userId: "customer-1",
  role: "user" as const,
};

const listRecord = {
  id: "order-1",
  orderNo: "ORD-0001",
  status: "pending",
  paymentStatus: "PENDING_COLLECTION",
  fulfillmentStatus: "UNFULFILLED",
  totalPrice: new Prisma.Decimal("125.50"),
  subtotal: new Prisma.Decimal("120.00"),
  shippingCost: new Prisma.Decimal("5.50"),
  discountAmount: new Prisma.Decimal("0"),
  currency: "USD",
  paymentMethod: "cod",
  placedAt: new Date("2026-07-24T10:00:00.000Z"),
  createdAt: new Date("2026-07-24T10:00:00.000Z"),
  updatedAt: new Date("2026-07-24T10:00:00.000Z"),
  user: {
    id: "customer-1",
    name: "Customer",
    email: "customer@example.com",
  },
  items: [
    {
      id: "item-1",
      sku: "SKU-1",
      productName: "Product",
      quantity: 2,
    },
  ],
  _count: { items: 1 },
};

describe("OrderQueryService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPrisma.$transaction.mockImplementation(
      (operations: Promise<unknown>[]) => Promise.all(operations),
    );
  });

  it("lists only retail orders with deterministic filters and string money", async () => {
    vi.mocked(getAuthSession).mockResolvedValue(adminSession);
    mockPrisma.order.findMany.mockResolvedValue([listRecord]);
    mockPrisma.order.count.mockResolvedValue(1);

    const result = await orderQueryService.listAdminOrders({
      search: "customer",
      paymentStatus: "PENDING_COLLECTION",
      fulfillmentStatus: "UNFULFILLED",
      dateFrom: "2026-07-01",
      dateTo: "2026-07-31",
      page: "1",
      limit: "25",
    });

    expect(result.success).toBe(true);
    expect(mockPrisma.order.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          placedAt: expect.objectContaining({
            not: null,
            gte: new Date("2026-07-01T00:00:00.000Z"),
            lte: new Date("2026-07-31T23:59:59.999Z"),
          }),
          paymentStatus: "PENDING_COLLECTION",
          fulfillmentStatus: "UNFULFILLED",
        }),
        orderBy: [{ placedAt: "desc" }, { id: "desc" }],
        skip: 0,
        take: 25,
      }),
    );
    if (result.success) {
      expect(result.data).toMatchObject({
        orders: [
          {
            totalPrice: "125.5",
            subtotal: "120",
            shippingCost: "5.5",
            discountAmount: "0",
          },
        ],
        pagination: { page: 1, limit: 25, total: 1, totalPages: 1 },
      });
    }
  });

  it("denies customer access to admin order queries", async () => {
    vi.mocked(getAuthSession).mockResolvedValue(customerSession);

    const result = await orderQueryService.listAdminOrders({});

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.statusCode).toBe(403);
    expect(mockPrisma.order.findMany).not.toHaveBeenCalled();
  });

  it("enforces ownership and retail scope in customer detail lookup", async () => {
    vi.mocked(getAuthSession).mockResolvedValue(customerSession);
    mockPrisma.order.findFirst.mockResolvedValue(null);

    const result = await orderQueryService.getCustomerOrder("order-other");

    expect(mockPrisma.order.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: "order-other",
          userId: "customer-1",
          placedAt: { not: null },
        },
      }),
    );
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.statusCode).toBe(404);
  });

  it("does not select provider references or event metadata", async () => {
    vi.mocked(getAuthSession).mockResolvedValue(customerSession);
    mockPrisma.order.findFirst.mockResolvedValue(null);

    await orderQueryService.getCustomerOrder("order-1");

    const query = mockPrisma.order.findFirst.mock.calls[0][0];
    expect(query.select.idempotencyKey).toBeUndefined();
    expect(query.select.payments.select.providerRef).toBeUndefined();
    expect(query.select.payments.select.events.select.metadata).toBeUndefined();
    expect(query.select.statusHistory.select.metadata).toBeUndefined();
    expect(query.select.shipments.select.metadata).toBeUndefined();
  });
});

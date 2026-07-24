import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getAuthSession: vi.fn(),
  requireRole: vi.fn(),
  findMany: vi.fn(),
  findUnique: vi.fn(),
  create: vi.fn(),
  count: vi.fn(),
}));

vi.mock("src/lib/authz", () => ({
  getAuthSession: mocks.getAuthSession,
  requireRole: mocks.requireRole,
}));

vi.mock("src/lib/audit", () => ({
  auditService: { log: vi.fn() },
}));

vi.mock("src/lib/prisma", () => ({
  prisma: {
    product: {
      findMany: mocks.findMany,
      findUnique: mocks.findUnique,
      create: mocks.create,
      count: mocks.count,
    },
  },
}));

import { GET as getAdminProducts } from "src/app/api/admin/products/route";
import {
  MAX_PRODUCT_VARIANTS,
  productService,
} from "src/lib/services/product";

describe("admin product query bounds", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getAuthSession.mockResolvedValue({
      userId: "admin-1",
      role: "admin",
    });
    mocks.findMany.mockResolvedValue([]);
    mocks.count.mockResolvedValue(0);
  });

  it("uses safe defaults for non-finite direct-service pagination", async () => {
    const result = await productService.list({
      page: Number.NaN,
      limit: Number.POSITIVE_INFINITY,
    });

    expect(result.success).toBe(true);
    expect(mocks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 20,
        include: expect.objectContaining({
          variants: expect.objectContaining({ take: MAX_PRODUCT_VARIANTS }),
        }),
      }),
    );
  });

  it("clamps direct-service page and page-size values", async () => {
    const first = await productService.list({ page: -5, limit: 10_000 });
    const last = await productService.list({ page: 100_001, limit: 100 });

    expect(first.success).toBe(true);
    expect(last.success).toBe(true);
    expect(mocks.findMany).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ skip: 0, take: 100 }),
    );
    expect(mocks.findMany).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ skip: 999_900, take: 100 }),
    );
  });

  it("rejects invalid route queries before invoking Prisma", async () => {
    const response = await getAdminProducts(
      new NextRequest(
        "http://localhost/api/admin/products?limit=101&page=1000001",
      ),
    );

    expect(response.status).toBe(400);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(mocks.findMany).not.toHaveBeenCalled();
    expect(mocks.count).not.toHaveBeenCalled();
  });

  it("rejects invalid direct-service filters before querying", async () => {
    const result = await productService.list({
      search: "x".repeat(121),
    });

    expect(result.success).toBe(false);
    expect(mocks.findMany).not.toHaveBeenCalled();
    expect(mocks.count).not.toHaveBeenCalled();
  });

  it("rejects oversized nested product creation before querying", async () => {
    const variants = Array.from(
      { length: MAX_PRODUCT_VARIANTS + 1 },
      (_, index) => ({
        sku: `SKU-${index}`,
        price: 10,
        weightGrams: 0,
      }),
    );

    const result = await productService.create({
      name: "Bounded Product",
      slug: "bounded-product",
      description: "A sufficiently descriptive product.",
      variants,
    });

    expect(result.success).toBe(false);
    expect(mocks.findUnique).not.toHaveBeenCalled();
    expect(mocks.create).not.toHaveBeenCalled();
  });
});

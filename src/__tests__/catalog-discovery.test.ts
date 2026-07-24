import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET as getSuggestions } from "src/app/api/catalog/suggestions/route";
import { catalogQueryService } from "src/lib/services/catalog";

type CatalogSearchResult = {
  products: { id: string }[];
  total: number;
  totalPages: number;
  facets: {
    availability: {
      inStock: number;
      outOfStock: number;
    };
  };
};

const mockPrisma = vi.hoisted(() => ({
  $queryRaw: vi.fn(),
  product: {
    findMany: vi.fn(),
    count: vi.fn(),
  },
  category: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
  },
}));

vi.mock("src/lib/prisma", () => ({
  prisma: mockPrisma,
}));

function product(id: string, name: string) {
  return {
    id,
    name,
    slug: name.toLowerCase().replaceAll(" ", "-"),
    status: "published",
    createdAt: new Date("2026-07-24T00:00:00.000Z"),
    category: {
      id: "category-1",
      name: "Category",
      slug: "category",
    },
    variants: [
      {
        id: `variant-${id}`,
        sku: `SKU-${id}`,
        price: new Prisma.Decimal("25"),
        inventory: {
          onHand: 5,
          reserved: 1,
        },
      },
    ],
    media: [],
  };
}

describe("catalog discovery query budget", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("keeps filtering, counting, paging, and facets within three queries", async () => {
    mockPrisma.$queryRaw.mockResolvedValue([
      {
        id: "product-b",
        minPrice: new Prisma.Decimal("20"),
        availableQuantity: 4,
        total: 2,
        facetMinPrice: new Prisma.Decimal("20"),
        facetMaxPrice: new Prisma.Decimal("30"),
        inStockCount: 2,
        outOfStockCount: 0,
      },
      {
        id: "product-a",
        minPrice: new Prisma.Decimal("30"),
        availableQuantity: 2,
        total: 2,
        facetMinPrice: new Prisma.Decimal("20"),
        facetMaxPrice: new Prisma.Decimal("30"),
        inStockCount: 2,
        outOfStockCount: 0,
      },
    ]);
    mockPrisma.product.findMany.mockResolvedValue([
      product("product-a", "Alpha"),
      product("product-b", "Beta"),
    ]);
    mockPrisma.category.findMany.mockResolvedValue([
      {
        id: "category-1",
        name: "Category",
        slug: "category",
        _count: { products: 2 },
      },
    ]);

    const result = await catalogQueryService.search({
      query: "headphones",
      minPrice: 10,
      maxPrice: 100,
      availability: "in_stock",
      sort: "price_asc",
      page: 2,
      limit: 12,
    });

    expect(result.success).toBe(true);
    expect(mockPrisma.$queryRaw).toHaveBeenCalledTimes(1);
    expect(mockPrisma.product.findMany).toHaveBeenCalledTimes(1);
    expect(mockPrisma.category.findMany).toHaveBeenCalledTimes(1);
    expect(mockPrisma.category.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 100 }),
    );
    const catalogSql = mockPrisma.$queryRaw.mock.calls[0][0] as {
      strings: string[];
    };
    expect(catalogSql.strings.join("?")).toContain(
      'ORDER BY "minPrice" ASC, id ASC',
    );
    expect(
      mockPrisma.$queryRaw.mock.calls.length +
        mockPrisma.product.findMany.mock.calls.length +
        mockPrisma.category.findMany.mock.calls.length,
    ).toBe(3);
    expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: {
            in: ["product-b", "product-a"],
          },
        },
      }),
    );

    if (result.success) {
      const data = result.data as CatalogSearchResult;
      expect(data.products.map((item) => item.id)).toEqual([
        "product-b",
        "product-a",
      ]);
      expect(data.total).toBe(2);
      expect(data.facets.availability).toEqual({
        inStock: 2,
        outOfStock: 0,
      });
    }
  });

  it("returns an out-of-range empty page without loading product rows", async () => {
    mockPrisma.$queryRaw.mockResolvedValue([
      {
        id: null,
        minPrice: null,
        availableQuantity: null,
        total: 48,
        facetMinPrice: new Prisma.Decimal("10"),
        facetMaxPrice: new Prisma.Decimal("90"),
        inStockCount: 40,
        outOfStockCount: 8,
      },
    ]);
    mockPrisma.category.findMany.mockResolvedValue([]);

    const result = await catalogQueryService.search({
      page: 10,
      limit: 24,
    });

    expect(result.success).toBe(true);
    expect(mockPrisma.product.findMany).not.toHaveBeenCalled();

    if (result.success) {
      const data = result.data as CatalogSearchResult;
      expect(data.products).toEqual([]);
      expect(data.total).toBe(48);
      expect(data.totalPages).toBe(2);
    }
  });

  it("rejects an inverted price range before querying", async () => {
    const result = await catalogQueryService.search({
      minPrice: 100,
      maxPrice: 10,
    });

    expect(result.success).toBe(false);
    expect(mockPrisma.$queryRaw).not.toHaveBeenCalled();
  });

  it("validates and caps the suggestion request before querying", async () => {
    mockPrisma.product.findMany.mockResolvedValue([
      {
        id: "product-a",
        name: "Alpha",
        slug: "alpha",
        brand: "Acme",
        media: [],
        variants: [{ price: new Prisma.Decimal("25") }],
      },
    ]);

    const invalid = await catalogQueryService.suggest({
      query: "alpha",
      limit: 50,
    });
    const valid = await catalogQueryService.suggest({
      query: "alpha",
      limit: 8,
    });

    expect(invalid.success).toBe(false);
    expect(valid.success).toBe(true);
    expect(mockPrisma.product.findMany).toHaveBeenCalledTimes(1);
    expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ name: "asc" }, { id: "asc" }],
        take: 8,
      }),
    );
  });

  it("returns a bounded public suggestion response from the API", async () => {
    mockPrisma.product.findMany.mockResolvedValue([
      {
        id: "product-a",
        name: "Alpha",
        slug: "alpha",
        brand: "Acme",
        category: {
          id: "category-1",
          name: "Category",
          slug: "category",
        },
        media: [],
        variants: [{ price: new Prisma.Decimal("25") }],
      },
    ]);

    const response = await getSuggestions(
      new NextRequest(
        "http://localhost/api/catalog/suggestions?query=alpha&limit=5",
      ),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("s-maxage=30");
    expect(await response.json()).toMatchObject({
      query: "alpha",
      suggestions: [
        {
          id: "product-a",
          slug: "alpha",
          minPrice: "25",
        },
      ],
    });
    expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 5 }),
    );
  });

  it("caps featured, category, and nested public catalog queries", async () => {
    mockPrisma.product.findMany.mockResolvedValue([]);
    mockPrisma.product.count.mockResolvedValue(0);
    mockPrisma.category.findMany.mockResolvedValue([]);
    mockPrisma.category.findUnique.mockResolvedValue({
      id: "category-1",
      name: "Category",
      slug: "category",
    });

    await catalogQueryService.getFeatured(10_000);
    await catalogQueryService.getByCategory("category", -4, 10_000);
    await catalogQueryService.getActiveCategories();

    expect(mockPrisma.product.findMany).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        take: 48,
        orderBy: [{ createdAt: "desc" }, { id: "asc" }],
        include: expect.objectContaining({
          variants: expect.objectContaining({ take: 100 }),
        }),
      }),
    );
    expect(mockPrisma.product.findMany).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        skip: 0,
        take: 100,
        include: expect.objectContaining({
          variants: expect.objectContaining({ take: 100 }),
        }),
      }),
    );
    expect(mockPrisma.category.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 100,
        include: expect.objectContaining({
          children: expect.objectContaining({ take: 100 }),
        }),
      }),
    );
  });
});

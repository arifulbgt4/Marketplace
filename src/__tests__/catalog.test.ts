import { describe, it, expect } from "vitest";
import {
  productSchema,
  productUpdateSchema,
  variantSchema,
  categorySchema,
  catalogSearchSchema,
  validatePublish,
} from "src/lib/catalog";

describe("productSchema", () => {
  it("validates a correct product", () => {
    const result = productSchema.safeParse({
      name: "Test Product",
      slug: "test-product",
      description: "A valid product description that is long enough",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short name", () => {
    const result = productSchema.safeParse({
      name: "A",
      slug: "test-product",
      description: "A valid product description that is long enough",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid slug", () => {
    const result = productSchema.safeParse({
      name: "Test Product",
      slug: "Invalid Slug With Spaces",
      description: "A valid product description that is long enough",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short description", () => {
    const result = productSchema.safeParse({
      name: "Test Product",
      slug: "test-product",
      description: "Short",
    });
    expect(result.success).toBe(false);
  });

  it("defaults status to draft", () => {
    const result = productSchema.parse({
      name: "Test Product",
      slug: "test-product",
      description: "A valid product description that is long enough",
    });
    expect(result.status).toBe("draft");
  });

  it("allows optional fields", () => {
    const result = productSchema.safeParse({
      name: "Test Product",
      slug: "test-product",
      description: "A valid product description that is long enough",
      brand: "TestBrand",
      taxClass: "standard",
      categoryId: "123e4567-e89b-12d3-a456-426614174000",
    });
    expect(result.success).toBe(true);
  });
});

describe("productUpdateSchema", () => {
  it("allows partial updates", () => {
    const result = productUpdateSchema.safeParse({ name: "New Name" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid slug in update", () => {
    const result = productUpdateSchema.safeParse({ slug: "has spaces" });
    expect(result.success).toBe(false);
  });
});

describe("variantSchema", () => {
  it("validates a correct variant", () => {
    const result = variantSchema.safeParse({
      sku: "TEST-001",
      price: 29.99,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty SKU", () => {
    const result = variantSchema.safeParse({
      sku: "",
      price: 29.99,
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero price", () => {
    const result = variantSchema.safeParse({
      sku: "TEST-001",
      price: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative price", () => {
    const result = variantSchema.safeParse({
      sku: "TEST-001",
      price: -10,
    });
    expect(result.success).toBe(false);
  });

  it("allows optional barcode and compareAtPrice", () => {
    const result = variantSchema.safeParse({
      sku: "TEST-001",
      price: 29.99,
      barcode: "123456789",
      compareAtPrice: 39.99,
    });
    expect(result.success).toBe(true);
  });
});

describe("categorySchema", () => {
  it("validates a correct category", () => {
    const result = categorySchema.safeParse({
      name: "Electronics",
      slug: "electronics",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short name", () => {
    const result = categorySchema.safeParse({
      name: "A",
      slug: "electronics",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid slug", () => {
    const result = categorySchema.safeParse({
      name: "Electronics",
      slug: "Electronics With Spaces",
    });
    expect(result.success).toBe(false);
  });

  it("allows parent reference", () => {
    const result = categorySchema.safeParse({
      name: "Laptops",
      slug: "laptops",
      parentId: "123e4567-e89b-12d3-a456-426614174000",
    });
    expect(result.success).toBe(true);
  });
});

describe("catalogSearchSchema", () => {
  it("provides defaults", () => {
    const result = catalogSearchSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(24);
    expect(result.sort).toBe("newest");
  });

  it("validates sort values", () => {
    const result = catalogSearchSchema.safeParse({ sort: "invalid" });
    expect(result.success).toBe(false);
  });

  it("allows all search params", () => {
    const result = catalogSearchSchema.safeParse({
      query: "headphones",
      categoryId: "123e4567-e89b-12d3-a456-426614174000",
      minPrice: 10,
      maxPrice: 100,
      sort: "price_asc",
      page: 2,
      limit: 12,
    });
    expect(result.success).toBe(true);
  });
});

describe("validatePublish", () => {
  it("rejects product without category", () => {
    const result = validatePublish({
      status: "draft",
      variants: [{ sku: "TEST", price: 10 }],
      media: [{ url: "https://example.com/img.jpg" }],
      categoryId: null,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Product must have a category");
  });

  it("rejects product without variants", () => {
    const result = validatePublish({
      status: "draft",
      variants: [],
      media: [{ url: "https://example.com/img.jpg" }],
      categoryId: "some-category-id",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Product must have at least one variant");
  });

  it("rejects product without media", () => {
    const result = validatePublish({
      status: "draft",
      variants: [{ sku: "TEST", price: 10 }],
      media: [],
      categoryId: "some-category-id",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Product must have at least one media item");
  });

  it("rejects variants without SKU", () => {
    const result = validatePublish({
      status: "draft",
      variants: [{ sku: "", price: 10 }],
      media: [{ url: "https://example.com/img.jpg" }],
      categoryId: "some-category-id",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("All variants must have a SKU");
  });

  it("rejects variants without price", () => {
    const result = validatePublish({
      status: "draft",
      variants: [{ sku: "TEST", price: null }],
      media: [{ url: "https://example.com/img.jpg" }],
      categoryId: "some-category-id",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("All variants must have a positive price");
  });

  it("passes when all conditions met", () => {
    const result = validatePublish({
      status: "draft",
      variants: [{ sku: "TEST-001", price: 29.99 }],
      media: [{ url: "https://example.com/img.jpg" }],
      categoryId: "some-category-id",
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

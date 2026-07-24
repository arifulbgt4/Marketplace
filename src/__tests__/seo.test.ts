import { describe, expect, it } from "vitest";

import {
  buildCategoryMetadata,
  buildMarketplaceSitemap,
  buildProductJsonLd,
  buildProductMetadata,
  type ProductSeoData,
} from "src/lib/seo";

const product: ProductSeoData = {
  name: "Reusable Product",
  slug: "reusable-product",
  description: "A reusable product for marketplace SEO verification.",
  brand: "Example Brand",
  categoryName: "Examples",
  images: ["https://cdn.example.com/product.jpg"],
  variants: [
    { sku: "SKU-1", price: 10, availableQuantity: 0 },
    { sku: "SKU-2", price: 15.5, availableQuantity: 3 },
  ],
  reviewSummary: { average: 4.5, count: 2 },
};

describe("product SEO output", () => {
  it("builds locale-aware canonical and social metadata", () => {
    const metadata = buildProductMetadata(product, {
      baseUrl: "https://market.example/",
      locale: "bn",
    });

    expect(metadata.title).toBe(product.name);
    expect(metadata.alternates?.canonical).toBe(
      "https://market.example/bn/products/reusable-product",
    );
    expect(metadata.openGraph).toMatchObject({
      url: "https://market.example/bn/products/reusable-product",
      title: product.name,
    });
  });

  it("includes aggregate offers and only supplied approved review summary", () => {
    const jsonLd = buildProductJsonLd(product, {
      baseUrl: "https://market.example/",
      locale: "en",
      currency: "USD",
      businessName: "Marketplace",
    });

    expect(jsonLd).toMatchObject({
      "@type": "Product",
      offers: {
        "@type": "AggregateOffer",
        lowPrice: "10.00",
        highPrice: "15.50",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      aggregateRating: {
        ratingValue: "4.5",
        reviewCount: 2,
      },
    });
  });

  it("omits aggregateRating when there are no approved reviews", () => {
    const jsonLd = buildProductJsonLd(
      { ...product, reviewSummary: { average: 0, count: 0 } },
      {
        baseUrl: "https://market.example/",
        locale: "en",
        currency: "USD",
        businessName: "Marketplace",
      },
    );

    expect(jsonLd).not.toHaveProperty("aggregateRating");
  });
});

describe("category metadata and sitemap output", () => {
  it("builds a canonical category landing metadata contract", () => {
    const metadata = buildCategoryMetadata(
      { name: "Examples", slug: "examples", productCount: 3 },
      { baseUrl: "https://market.example/", locale: "en" },
    );

    expect(metadata).toMatchObject({
      title: "Examples",
      alternates: {
        canonical: "https://market.example/en/products/category/examples",
      },
    });
  });

  it("emits locale-aware storefront, category, and product URLs", () => {
    const updatedAt = new Date("2026-07-24T12:00:00.000Z");
    const entries = buildMarketplaceSitemap({
      baseUrl: "https://market.example/",
      locales: ["en", "bn"],
      products: [{ slug: "reusable-product", updatedAt }],
      categories: [{ slug: "examples", updatedAt }],
    });
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain(
      "https://market.example/en/products/reusable-product",
    );
    expect(urls).toContain(
      "https://market.example/bn/products/category/examples",
    );
    expect(urls.some((entry) => entry.includes("signin"))).toBe(false);
    expect(entries).toHaveLength(8);
  });
});

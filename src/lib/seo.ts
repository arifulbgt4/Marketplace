import type { Metadata, MetadataRoute } from "next";

export type ProductSeoData = {
  name: string;
  slug: string;
  description: string;
  brand: string | null;
  categoryName: string | null;
  images: string[];
  variants: Array<{
    sku: string;
    price: number;
    availableQuantity: number;
  }>;
  reviewSummary: {
    average: number;
    count: number;
  };
};

export type CategorySeoData = {
  name: string;
  slug: string;
  productCount: number;
};

function url(baseUrl: string, pathname: string) {
  return new URL(pathname, baseUrl).toString();
}

function description(value: string, maxLength = 160) {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length <= maxLength
    ? normalized
    : `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

export function buildProductMetadata(
  product: ProductSeoData,
  options: { baseUrl: string; locale: string },
): Metadata {
  const canonical = url(
    options.baseUrl,
    `/${options.locale}/products/${encodeURIComponent(product.slug)}`,
  );
  const summary = description(product.description);

  return {
    title: product.name,
    description: summary,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title: product.name,
      description: summary,
      images: product.images.map((image) => ({
        url: image,
        alt: product.name,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: summary,
      images: product.images.slice(0, 1),
    },
  };
}

export function buildProductJsonLd(
  product: ProductSeoData,
  options: {
    baseUrl: string;
    locale: string;
    currency: string;
    businessName: string;
  },
) {
  const prices = product.variants.map((variant) => variant.price);
  const available = product.variants.some(
    (variant) => variant.availableQuantity > 0,
  );
  const productUrl = url(
    options.baseUrl,
    `/${options.locale}/products/${encodeURIComponent(product.slug)}`,
  );

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: description(product.description, 500),
    url: productUrl,
    image: product.images,
    ...(product.variants[0]?.sku ? { sku: product.variants[0].sku } : {}),
    ...(product.brand
      ? { brand: { "@type": "Brand", name: product.brand } }
      : { brand: { "@type": "Brand", name: options.businessName } }),
    ...(product.categoryName ? { category: product.categoryName } : {}),
    ...(prices.length
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: options.currency,
            lowPrice: Math.min(...prices).toFixed(2),
            highPrice: Math.max(...prices).toFixed(2),
            offerCount: prices.length,
            availability: available
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: productUrl,
          },
        }
      : {}),
    ...(product.reviewSummary.count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.reviewSummary.average.toFixed(1),
            reviewCount: product.reviewSummary.count,
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
  };
}

export function buildCategoryMetadata(
  category: CategorySeoData,
  options: { baseUrl: string; locale: string },
): Metadata {
  const canonical = url(
    options.baseUrl,
    `/${options.locale}/products/category/${encodeURIComponent(category.slug)}`,
  );
  const summary = `Browse ${category.productCount} published product${
    category.productCount === 1 ? "" : "s"
  } in ${category.name}.`;

  return {
    title: category.name,
    description: summary,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title: category.name,
      description: summary,
    },
  };
}

export function buildMarketplaceSitemap(input: {
  baseUrl: string;
  locales: readonly string[];
  products: ReadonlyArray<{ slug: string; updatedAt: Date }>;
  categories: ReadonlyArray<{ slug: string; updatedAt: Date }>;
}): MetadataRoute.Sitemap {
  return input.locales.flatMap((locale) => [
    {
      url: url(input.baseUrl, `/${locale}`),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: url(input.baseUrl, `/${locale}/products`),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    ...input.categories.map((category) => ({
      url: url(
        input.baseUrl,
        `/${locale}/products/category/${encodeURIComponent(category.slug)}`,
      ),
      lastModified: category.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...input.products.map((product) => ({
      url: url(
        input.baseUrl,
        `/${locale}/products/${encodeURIComponent(product.slug)}`,
      ),
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ]);
}

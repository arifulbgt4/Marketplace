import type { MetadataRoute } from "next";

import { siteConfig } from "src/global/config";
import { locales } from "src/global/staticData";
import { prisma } from "src/lib/prisma";
import { buildMarketplaceSitemap } from "src/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: "published",
        category: { isActive: true },
      },
      select: { slug: true, updatedAt: true },
      orderBy: { slug: "asc" },
    }),
    prisma.category.findMany({
      where: {
        isActive: true,
        products: { some: { status: "published" } },
      },
      select: { slug: true, updatedAt: true },
      orderBy: { slug: "asc" },
    }),
  ]);

  return buildMarketplaceSitemap({
    baseUrl: siteConfig.url,
    locales,
    products,
    categories,
  });
}

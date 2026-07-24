import type { Metadata } from "next";
import { cache } from "react";

import { siteConfig } from "src/global/config";
import { prisma } from "src/lib/prisma";
import {
  buildProductJsonLd,
  buildProductMetadata,
  type ProductSeoData,
} from "src/lib/seo";
import { getStorefrontSettings } from "src/lib/storefront-settings";

import ProductDetailClient from "./ProductDetailClient";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const getProductSeoData = cache(
  async (slug: string): Promise<ProductSeoData | null> => {
    const product = await prisma.product.findFirst({
      where: {
        slug,
        status: "published",
        category: { isActive: true },
      },
      select: {
        name: true,
        slug: true,
        description: true,
        brand: true,
        category: { select: { name: true } },
        media: {
          select: { url: true },
          orderBy: { order: "asc" },
        },
        variants: {
          select: {
            sku: true,
            price: true,
            inventory: { select: { onHand: true, reserved: true } },
          },
        },
        reviews: {
          where: { status: "APPROVED" },
          select: { rating: true },
        },
      },
    });
    if (!product) return null;
    const ratingTotal = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );

    return {
      name: product.name,
      slug: product.slug,
      description: product.description,
      brand: product.brand,
      categoryName: product.category?.name ?? null,
      images: product.media.map((media) => media.url),
      variants: product.variants.map((variant) => ({
        sku: variant.sku,
        price: Number(variant.price),
        availableQuantity: Math.max(
          0,
          (variant.inventory?.onHand ?? 0) - (variant.inventory?.reserved ?? 0),
        ),
      })),
      reviewSummary: {
        average: product.reviews.length
          ? ratingTotal / product.reviews.length
          : 0,
        count: product.reviews.length,
      },
    };
  },
);

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductSeoData(slug);
  if (!product) {
    return {
      title: "Product not found",
      robots: { index: false, follow: false },
    };
  }
  return buildProductMetadata(product, {
    baseUrl: siteConfig.url,
    locale,
  });
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const [product, settings] = await Promise.all([
    getProductSeoData(slug),
    getStorefrontSettings(),
  ]);
  const jsonLd = product
    ? buildProductJsonLd(product, {
        baseUrl: siteConfig.url,
        locale,
        currency: settings.business.defaultCurrency,
        businessName: settings.business.displayName,
      })
    : null;

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      ) : null}
      <ProductDetailClient slug={slug} />
    </>
  );
}

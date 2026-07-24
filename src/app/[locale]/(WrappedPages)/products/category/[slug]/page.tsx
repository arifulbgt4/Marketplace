import {
  Breadcrumbs,
  Button,
  Container,
  Link as MuiLink,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { siteConfig } from "src/global/config";
import { prisma } from "src/lib/prisma";
import { buildCategoryMetadata } from "src/lib/seo";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const getCategory = cache((slug: string) =>
  prisma.category.findUnique({
    where: { slug, isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: {
          products: { where: { status: "published" } },
        },
      },
    },
  }),
);

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = await getCategory(slug);
  if (!category) {
    return {
      title: "Category not found",
      robots: { index: false, follow: false },
    };
  }
  return buildCategoryMetadata(
    {
      name: category.name,
      slug: category.slug,
      productCount: category._count.products,
    },
    { baseUrl: siteConfig.url, locale },
  );
}

export default async function ProductCategoryPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink component={Link} href={`/${locale}`} color="inherit">
          Home
        </MuiLink>
        <MuiLink component={Link} href={`/${locale}/products`} color="inherit">
          Products
        </MuiLink>
        <Typography color="text.primary">{category.name}</Typography>
      </Breadcrumbs>
      <Paper variant="outlined" sx={{ p: { xs: 3, md: 5 } }}>
        <Stack spacing={2} alignItems="flex-start">
          <Typography component="h1" variant="h3">
            {category.name}
          </Typography>
          <Typography color="text.secondary">
            {category._count.products} published product
            {category._count.products === 1 ? "" : "s"} available in this
            category.
          </Typography>
          <Button
            component={Link}
            href={`/${locale}/products?categoryId=${category.id}`}
            variant="contained"
          >
            Browse {category.name}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

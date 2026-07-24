import { setRequestLocale } from "next-intl/server";
import { Box, Grid } from "@mui/material";
// import { useTranslations } from "next-intl";

import FeaturedProducts from "src/widgets/FeaturedProducts";
import SearchBanner from "src/widgets/SearchBanner";
import ConfiguredHomeSections, {
  type ConfiguredHomeSection,
} from "src/widgets/ConfiguredHomeSections";
import { contentSectionService } from "src/lib/services/content-section";
import { catalogQueryService } from "src/lib/services/catalog";
import type { ProductCategoryShortcut } from "src/forms/SearchFilterForm/product-search";

function isHomepageCategory(
  value: unknown,
): value is ProductCategoryShortcut {
  if (!value || typeof value !== "object") return false;
  const category = value as Record<string, unknown>;
  return (
    typeof category.id === "string" &&
    category.id.trim().length > 0 &&
    typeof category.name === "string" &&
    category.name.trim().length > 0
  );
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [configuredSections, activeCategoryResult] = await Promise.all([
    contentSectionService.listPublished(locale),
    catalogQueryService.getActiveCategories().catch(() => null),
  ]);
  const sections = configuredSections.success
    ? (configuredSections.data as ConfiguredHomeSection[])
    : [];
  const activeCategories =
    activeCategoryResult?.success && Array.isArray(activeCategoryResult.data)
      ? activeCategoryResult.data
          .filter(isHomepageCategory)
          .slice(0, 5)
          .map(({ id, name }) => ({ id: id.trim(), name: name.trim() }))
      : [];

  // const t = useTranslations();
  return (
    <Box pt={{ xs: 8, md: 0 }}>
      <Grid container>
        <Grid item xs={12} data-testid="protected-home-hero-search">
          <SearchBanner activeCategories={activeCategories} />
        </Grid>
        <Grid item xs={12}>
          <FeaturedProducts />
        </Grid>
        <Grid item xs={12}>
          <ConfiguredHomeSections sections={sections} />
        </Grid>
      </Grid>
    </Box>
  );
}

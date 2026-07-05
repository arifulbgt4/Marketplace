import { setRequestLocale } from "next-intl/server";
import { Box, Grid, Link } from "@mui/material";
// import { useTranslations } from "next-intl";

import FeaturedListings from "src/widgets/FeaturedListings";
import FeaturedProducts from "src/widgets/FeaturedProducts";
import SearchBanner from "src/widgets/SearchBanner";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // const t = useTranslations();
  return (
    <Box pt={{ xs: 8, md: 0 }}>
      <Grid container>
        <Grid item xs={12}>
          <SearchBanner />
        </Grid>
        <Grid item xs={12} zIndex={99}>
          <div>
            <FeaturedListings />
          </div>
        </Grid>
        <Grid item xs={12}>
          <FeaturedProducts />
        </Grid>
      </Grid>
    </Box>
  );
}

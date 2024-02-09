import { unstable_setRequestLocale } from "next-intl/server";
import { Box, Grid } from "@mui/material";
// import { useTranslations } from "next-intl";

import FeaturedListings from "src/widgets/FeaturedListings";
import SearchBanner from "src/widgets/SearchBanner";
import RecentListings from "src/widgets/RecentListings";

export default function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  // const t = useTranslations();
  return (
    <Box pt={{ xs: 8, md: 0 }}>
      <Grid container rowSpacing={5}>
        <Grid item xs={12}>
          <SearchBanner />
        </Grid>
        <Grid item xs={12} zIndex={99}>
          <div>
            <FeaturedListings />
          </div>
        </Grid>
      </Grid>
    </Box>
  );
}

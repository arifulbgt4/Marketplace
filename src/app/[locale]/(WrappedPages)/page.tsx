// import { useTranslations } from "next-intl";
import { Grid } from "@mui/material";

import FeaturedListings from "src/widgets/FeaturedListings";
import SearchBanner from "src/widgets/SearchBanner";
import RecentListings from "src/widgets/RecentListings";
import { unstable_setRequestLocale } from "next-intl/server";

export default function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  // const t = useTranslations();
  return (
    <Grid container rowSpacing={5}>
      <Grid item xs={12}>
        <SearchBanner />
      </Grid>
      <Grid item xs={12}>
        <FeaturedListings />
      </Grid>
      <Grid item xs={12}>
        <RecentListings />
      </Grid>
    </Grid>
  );
}

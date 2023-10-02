// import { useTranslations } from "next-intl";

import { Grid } from "@mui/material";

import FeaturedProperties from "src/widgets/FeaturedProperties";
import HeroBanner from "src/widgets/HeroBanner";
import RecentProperties from "src/widgets/RecentProperties";

export default function Home() {
  // const t = useTranslations();
  return (
    <Grid container>
      <Grid item xs={12}>
        <HeroBanner />
      </Grid>
      <Grid item xs={12}>
        <FeaturedProperties />
      </Grid>
      <Grid item xs={12}>
        <RecentProperties />
      </Grid>
    </Grid>
  );
}

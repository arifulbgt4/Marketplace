// import { useTranslations } from "next-intl";
import { Grid } from "@mui/material";

import FeaturedListings from "src/widgets/FeaturedListings";
import SearchBanner from "src/widgets/SearchBanner";
import RecentListings from "src/widgets/RecentListings";

export default function Home() {
  // const t = useTranslations();
  return (
    <Grid container spacing={20}>
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

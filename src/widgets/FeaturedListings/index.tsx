import { FC } from "react";
import { useTranslations } from "next-intl";
import { Grid, Typography, Box } from "@mui/material";

import Listing from "src/widgets/Listing";

import { FeaturedListingsProps } from "./Types";

const FeaturedListings: FC<FeaturedListingsProps> = () => {
  const t = useTranslations();
  return (
    <Grid
      container
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 4, sm: 8, md: 12 }}
    >
      <Grid item xs={12}>
        <Typography variant="h3" fontWeight="400">
          {t("sectionTitle.featuredProperties")}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Listing />
      </Grid>
      <Grid item xs={4}>
        <Listing />
      </Grid>
      <Grid item xs={4}>
        <Listing />
      </Grid>
      <Grid item xs={4}>
        <Listing />
      </Grid>
      <Grid item xs={4}>
        <Listing />
      </Grid>
      <Grid item xs={4}>
        <Listing />
      </Grid>
    </Grid>
  );
};

export default FeaturedListings;

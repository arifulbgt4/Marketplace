import { FC } from "react";
import { useTranslations } from "next-intl";
import { Grid, Typography } from "@mui/material";

import Listing from "src/widgets/Listing";

import { FeaturedListingsProps } from "./Types";

const FeaturedListings: FC<FeaturedListingsProps> = () => {
  const t = useTranslations();
  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Typography variant="h3">
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

import { FC } from "react";
import { useTranslations } from "next-intl";
import { Grid, Typography, Box, Stack } from "@mui/material";

import Listing from "src/widgets/Listing";

import { FeaturedListingsProps } from "./Types";
import { siteConfig } from "src/global/config";

const FeaturedListings: FC<FeaturedListingsProps> = () => {
  const t = useTranslations();
  return (
    <Stack justifyContent="center" alignItems="center">
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        maxWidth={siteConfig.maxWidth}
      >
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
    </Stack>
  );
};

export default FeaturedListings;

import { FC } from "react";
import { useTranslations } from "next-intl";
import { Box, Container, Grid, Typography } from "@mui/material";

import Listing from "src/widgets/Listing";

import { RecentListingsProps } from "./Types";

const RecentListings: FC<RecentListingsProps> = () => {
  const t = useTranslations();
  return (
    <Box>
      <Container>
        <Grid container spacing={5} pt={1}>
          <Grid item xs={12}>
            <Typography variant="h3">
              {t("sectionTitle.recentProperties")}
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
      </Container>
    </Box>
  );
};

export default RecentListings;

import { FC } from "react";
import { Grid } from "@mui/material";

import { FeaturedListingsProps } from "./Types";
import Listing from "../Listing";

const FeaturedListings: FC<FeaturedListingsProps> = () => {
  return (
    <Grid container spacing={5}>
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

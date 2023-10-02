import { FC } from "react";

import { RecentListingsProps } from "./Types";
import { Grid } from "@mui/material";
import Listing from "../Listing";

const RecentListings: FC<RecentListingsProps> = () => {
  return (
    <Grid container spacing={5} pt={1}>
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

export default RecentListings;

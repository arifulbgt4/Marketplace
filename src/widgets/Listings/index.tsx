import { FC } from "react";
import { Grid } from "@mui/material";

import Listing from "src/widgets/Listing";
import { ListingsProps } from "./Types";

const Listings: FC<ListingsProps> = () => {
  return (
    <Grid container>
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

export default Listings;

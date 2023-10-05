import { FC } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";

import Listing from "src/widgets/Listing";
import { ListingsProps } from "./Types";

const Listings: FC<ListingsProps> = () => {
  return (
    <Box>
      <Typography variant="h4">WE Found 91 Results</Typography>
      <Paper>
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
      </Paper>
    </Box>
  );
};

export default Listings;

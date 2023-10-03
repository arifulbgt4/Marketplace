import { FC } from "react";
import { Grid, Paper } from "@mui/material";

import Listing from "src/widgets/Listing";

const UserListing: FC = () => {
  return (
    <Paper>
      <Grid container gap={5}>
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
  );
};

export default UserListing;

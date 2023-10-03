import { Grid, Typography } from "@mui/material";

import UserListing from "src/widgets/UserListing";

const Listing = () => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <UserListing />
      </Grid>
    </Grid>
  );
};

export default Listing;

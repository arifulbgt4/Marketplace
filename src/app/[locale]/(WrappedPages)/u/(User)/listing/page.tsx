import { Grid } from "@mui/material";

import OwnListing from "src/widgets/OwnListing";

const ListingPage = () => {
  return (
    <Grid container columnSpacing={8} rowSpacing={5}>
      <Grid item xs={12} md={8}>
        <OwnListing />
      </Grid>
    </Grid>
  );
};

export default ListingPage;

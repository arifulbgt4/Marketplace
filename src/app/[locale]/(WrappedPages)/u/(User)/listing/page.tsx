import { Grid } from "@mui/material";

import OwnListingMap from "src/widgets/OwnListingMap";

import OwnListing from "src/widgets/OwnListing";

const ListingPage = () => {
  return (
    <Grid container columnSpacing={8} rowSpacing={5}>
      <Grid item xs={12} md={8}>
        <OwnListing />
      </Grid>
      <Grid item xs={12} md={4}>
        <OwnListingMap />
      </Grid>
    </Grid>
  );
};

export default ListingPage;

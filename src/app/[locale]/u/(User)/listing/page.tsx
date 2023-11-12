import { Grid } from "@mui/material";

import OwnListingMap from "src/widgets/OwnListingMap";

import OwnListing from "src/widgets/OwnListing";

const ListingPage = () => {
  return (
    <Grid container columnSpacing={8} rowSpacing={5}>
      <Grid item container xs={8} rowSpacing={5}>
        <Grid item xs={12}>
          <OwnListing />
        </Grid>
      </Grid>
      <Grid item xs={4}>
        <OwnListingMap />
      </Grid>
    </Grid>
  );
};

export default ListingPage;

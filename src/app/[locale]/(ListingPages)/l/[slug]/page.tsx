import { Grid, Paper, Typography } from "@mui/material";

import ListingDetailsContent from "src/widgets/ListingDetailsContent/inedx";
import PropertyDetailsBanner from "src/widgets/PropertyDetailsBanner";

const Details = () => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <PropertyDetailsBanner />
      </Grid>
      <Grid item xs={8}>
        <ListingDetailsContent />
      </Grid>
      <Grid item xs={4}>
        PropertyDetailsSidebar
      </Grid>
    </Grid>
  );
};

export default Details;

import { Grid, Paper, Typography } from "@mui/material";

import ListingDetailsContent from "src/widgets/ListingDetailsContent/inedx";
import ListingDetailsBanner from "src/widgets/ListingDetailsBanner";
import ListingDetailsSidebar from "src/widgets/ListingDetailsSidebar";

const Details = () => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <ListingDetailsBanner />
      </Grid>
      <Grid item xs={8}>
        <ListingDetailsContent />
      </Grid>
      <Grid item xs={4}>
        <ListingDetailsSidebar />
      </Grid>
    </Grid>
  );
};

export default Details;

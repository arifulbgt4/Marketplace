import { Grid, Paper, Typography } from "@mui/material";
import ListingDetailsCard from "src/widgets/ListingDetailsCard/inedx";

const Details = () => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Paper>
          <Typography variant="h3">Property Details </Typography>
        </Paper>
      </Grid>
      <Grid item xs={8}>
        <ListingDetailsCard />
      </Grid>
      <Grid item xs={4}>
        <Paper>property</Paper>
      </Grid>
    </Grid>
  );
};

export default Details;

import { Box, Container, Grid } from "@mui/material";

import ListingDetailsContent from "src/widgets/ListingDetailsContent";
import ListingDetailsBanner from "src/widgets/ListingDetailsBanner";
import ListingBooking from "src/widgets/ListingBooking";

const Details = () => {
  return (
    <Box>
      <Container>
        <Grid container>
          <Grid item xs={12}>
            <ListingDetailsBanner />
          </Grid>
          <Grid item xs={8}>
            <ListingDetailsContent />
          </Grid>
          <Grid item xs={4}>
            <ListingBooking />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Details;

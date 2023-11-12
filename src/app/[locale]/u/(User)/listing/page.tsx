import { Grid, Box, Container, Typography } from "@mui/material";

import ListingHelpInfo from "src/widgets/ListingHelpInfo";

import OwnListing from "src/widgets/OwnListing";

const Listing = () => {
  return (
    <Box>
      <Container>
        <Grid container columnSpacing={20} rowSpacing={5}>
          <Grid item container xs={8} rowSpacing={5}>
            <Grid item xs={12}>
              <Typography variant="h4">My Listings</Typography>
            </Grid>
            <Grid item xs={12}>
              <OwnListing />
            </Grid>
          </Grid>
          <Grid item xs={4} mt={9}>
            <ListingHelpInfo />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Listing;

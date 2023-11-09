import { Grid, Box, Container } from "@mui/material";

import ListingHelpInfo from "src/widgets/ListingHelpInfo";

import OwnListing from "src/widgets/OwnListing";

const Listing = () => {
  return (
    <Box>
      <Container>
        <Grid container columnSpacing={10}>
          <Grid item xs={8}>
            <OwnListing />
          </Grid>
          <Grid item xs={4}>
            <ListingHelpInfo />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Listing;

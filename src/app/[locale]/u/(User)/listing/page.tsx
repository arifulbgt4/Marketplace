import { Grid, Box, Container } from "@mui/material";

import ListingHelpInfo from "src/widgets/ListingHelpInfo";

import UserListing from "src/widgets/UserListing";

const Listing = () => {
  return (
    <Box>
      <Container>
        <Grid container columnSpacing={10}>
          <Grid item xs={8}>
            <UserListing />
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

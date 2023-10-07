import { Grid, Typography, Box, Container } from "@mui/material";

import ListingPropertyBanner from "src/widgets/ListingPropertyBanner";
import SearchProperty from "src/widgets/SearchProperty";
import UserListing from "src/widgets/UserListing";

const Listing = () => {
  return (
    <Box>
      <Container>
        <Grid container>
          <Grid item xs={8}>
            <UserListing />
          </Grid>
          <Grid item xs={4}>
            <Box>
              <Typography variant="h4">Search Properties</Typography>
              <SearchProperty />
            </Box>
            <Box mt={3}>
              <ListingPropertyBanner />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Listing;

import { Box, Container, Grid } from "@mui/material";

import UserListings from "src/widgets/UserListings";
import UserProfile from "src/widgets/UserProfile";
import UserReviews from "src/widgets/UserReviews";

const HostProfile = () => {
  return (
    <Box pt={5}>
      <Container>
        <Grid container columnSpacing={5} rowSpacing={3}>
          <Grid item xs={12} md={3}>
            <UserProfile />
          </Grid>
          <Grid item xs={12} md={6}>
            <UserListings />
          </Grid>
          <Grid item xs={12} md={3}>
            <UserReviews />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HostProfile;

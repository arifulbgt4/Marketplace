import { Box, Container, Grid } from "@mui/material";

import UserListings from "src/widgets/UserListings";
import UserProfile from "src/widgets/UserProfile";
import UserReviews from "src/widgets/UserReviews";

const HostProfile = () => {
  return (
    <Box>
      <Container>
        <Grid container>
          <Grid item xs={4}>
            <UserProfile />
          </Grid>
          <Grid item xs={4}>
            <UserListings />
          </Grid>
          <Grid item xs={4}>
            <UserReviews />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HostProfile;

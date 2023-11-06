import { Box, Container, Grid } from "@mui/material";
import React from "react";

const HostProfile = () => {
  return (
    <Box>
      <Container>
        <Grid container>
          <Grid item xs={4}>
            UserProfile
          </Grid>
          <Grid item xs={4}>
            UserListings
          </Grid>
          <Grid item xs={4}>
            UserReviews
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HostProfile;

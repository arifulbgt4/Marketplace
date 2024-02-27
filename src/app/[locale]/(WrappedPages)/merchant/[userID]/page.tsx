import { Box, CardMedia, Container, Stack } from "@mui/material";

import UserListings from "src/widgets/UserListings";
import UserProfile from "src/widgets/UserProfile";
import UserReviews from "src/widgets/UserReviews";

const HostProfile = () => {
  return (
    <Box>
      <CardMedia
        sx={{ height: { xs: 182, md: 276 } }}
        src="https://cdn.pixabay.com/photo/2015/01/08/18/27/startup-593341_1280.jpg"
        component="img"
        alt="JL"
      />
      <Container maxWidth="lg" sx={{ mt: { xs: -12, md: -18 } }}>
        <Stack gap={10}>
          <UserProfile />
          <UserListings />
          <UserReviews />
        </Stack>
      </Container>
    </Box>
  );
};

export default HostProfile;

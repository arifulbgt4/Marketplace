import { Box, CardMedia, Container, Stack } from "@mui/material";

import UserListings from "src/widgets/UserListings";
import UserProfile from "src/widgets/UserProfile";
import UserReviews from "src/widgets/UserReviews";

const HostProfile = () => {
  return (
    <Box>
      <CardMedia
        sx={{ height: { xs: 182, md: 236 } }}
        src="https://www.w3schools.com/howto/img_avatar.png"
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

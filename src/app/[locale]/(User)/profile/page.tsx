import { Grid, Box, Typography } from "@mui/material";

import SocialIconLink from "src/widgets/SocialIconLink";
import UserDetails from "src/widgets/UserDetails";

export default function Profile() {
  return (
    <Grid container>
      <Grid item xs={8}>
        <UserDetails />
      </Grid>
      <Grid item xs={4}>
        <Box>
          <Typography variant="h4">Social Links</Typography>
          <SocialIconLink />
        </Box>
      </Grid>
    </Grid>
  );
}

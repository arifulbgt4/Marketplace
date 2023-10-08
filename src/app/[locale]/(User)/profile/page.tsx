import { Grid, Box, Typography, Container } from "@mui/material";

import SocialIconLink from "src/components/SocialILink";
import UserDetails from "src/widgets/UserDetails";

export default function Profile() {
  return (
    <Box>
      <Container>
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
      </Container>
    </Box>
  );
}

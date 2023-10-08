import { Grid, Box, Typography, Container } from "@mui/material";

import SocialIconLink from "src/components/SocialILink";
import UserInfo from "src/widgets/UserInfo";

export default function Profile() {
  return (
    <Box>
      <Container>
        <Grid container>
          <Grid item xs={8}>
            <UserInfo />
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

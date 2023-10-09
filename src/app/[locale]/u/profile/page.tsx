import { Grid, Box, Container } from "@mui/material";
import Info from "src/components/Info";

import SocialIconLink from "src/components/SocialILink";
import UserInfo from "src/widgets/UserInfo";

export default function Profile() {
  return (
    <Box>
      <Container>
        <Grid container columnSpacing={10}>
          <Grid item xs={8}>
            <UserInfo />
          </Grid>
          <Grid item xs={4}>
            <Info title="Social Links">
              <SocialIconLink />
            </Info>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

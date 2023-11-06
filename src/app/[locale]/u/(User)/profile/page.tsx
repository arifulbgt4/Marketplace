import { Grid, Box, Container } from "@mui/material";

import ProfileHelpInfo from "src/widgets/ProfileHelpInfo";

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
            <ProfileHelpInfo />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

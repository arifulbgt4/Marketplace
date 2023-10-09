import { Grid, Container } from "@mui/material";

import SignupForm from "src/forms/SignupForm";
import SignupInfo from "src/widgets/SignupInfo";

export default function SignUp() {
  return (
    <Container>
      <Grid container>
        <Grid item sm={12} md={8}>
          <SignupForm />
        </Grid>
        <Grid item sm={12} md={4}>
          <SignupInfo />
        </Grid>
      </Grid>
    </Container>
  );
}

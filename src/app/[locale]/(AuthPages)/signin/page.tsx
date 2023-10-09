import { Grid, Container } from "@mui/material";

import SigninForm from "src/forms/SigninForm";
import SigninInfo from "src/widgets/SigninInfo";

export default function SignIn() {
  return (
    <Container>
      <Grid container>
        <Grid item sm={12} md={8}>
          <SigninForm />
        </Grid>
        <Grid item sm={12} md={4}>
          <SigninInfo />
        </Grid>
      </Grid>
    </Container>
  );
}

import { Grid, Container, Box } from "@mui/material";

import SigninForm from "src/forms/SigninForm";
import SigninInfo from "src/widgets/SigninInfo";

export default function SignIn() {
  return (
    <Box>
      <Container>
        <Grid container columnSpacing={8} rowSpacing={5}>
          <Grid item sm={12} md={8}>
            <SigninForm />
          </Grid>
          <Grid item sm={12} md={4}>
            <SigninInfo />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

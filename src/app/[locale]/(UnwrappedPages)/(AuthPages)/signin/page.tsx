import { Container, Stack } from "@mui/material";

import SigninForm from "src/forms/SigninForm";

export default function SignIn() {
  return (
    <Container>
      <Stack alignItems="center" justifyContent="center" height="100vh">
        <SigninForm />
      </Stack>
    </Container>
  );
}

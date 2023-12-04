"use client";
import {
  Container,
  Stack,
  Divider,
  Typography,
  Button,
  Grid,
  IconButton,
  Box,
} from "@mui/material";
import { FacebookRounded, Google } from "@mui/icons-material";

import Logo from "src/components/Logo";
import SigninForm from "src/forms/SigninForm";
import routes from "src/global/routes";

export default function SignIn() {
  return (
    <Container maxWidth="xs">
      <Stack alignItems="center" justifyContent="center" height="100vh">
        <Stack gap={2.5} width="100%">
          <Stack border={1} borderColor="divider" gap={2.5} sx={{ p: 4 }}>
            <Stack justifyContent="center" alignItems="center">
              <Logo />
            </Stack>
            <Divider />
            <Typography textAlign="center" variant="h3">
              Sign In
            </Typography>
            <SigninForm />
            <Grid
              container
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={5.5}>
                <Divider />
              </Grid>
              <Grid
                item
                xs={1}
                justifyContent="center"
                alignItems="center"
                display="flex"
              >
                <Typography variant="subtitle2" color="text.secondary">
                  or
                </Typography>
              </Grid>
              <Grid item xs={5.5}>
                <Divider />
              </Grid>
            </Grid>
            <Stack
              flexDirection="row"
              gap={5}
              justifyContent="center"
              alignItems="center"
            >
              <IconButton>
                <Google fontSize="large" />
              </IconButton>
              <IconButton>
                <FacebookRounded fontSize="large" color="primary" />
              </IconButton>
            </Stack>
            <Box alignItems="center" justifyContent="center" display="flex">
              <Button size="small">Forgot password?</Button>
            </Box>
          </Stack>
          <Stack
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            py={4}
            border={1}
            borderColor="divider"
          >
            <Typography variant="subtitle1">Have an account?</Typography>
            <Button href={routes.signup}>Sign up</Button>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}

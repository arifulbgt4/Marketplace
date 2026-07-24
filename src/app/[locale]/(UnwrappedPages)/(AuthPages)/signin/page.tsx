"use client";
import { Suspense } from "react";
import { Container, Stack, Divider, Typography, Button } from "@mui/material";

import Logo from "src/components/Logo";
import routes from "src/global/routes";
import SigninForm from "src/forms/SigninForm";
import { useTranslations } from "next-intl";

export default function SignIn() {
  const t = useTranslations("Auth");
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
              {t("signIn")}
            </Typography>
            <Suspense>
              <SigninForm />
            </Suspense>
            <Button size="small" href={routes.forgotPassword}>
              {t("forgotPassword")}
            </Button>
            <Button size="small" href={routes.verifyEmail}>
              {t("resendVerification")}
            </Button>
          </Stack>
          <Stack
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            py={3}
            border={1}
            borderColor="divider"
          >
            <Typography variant="subtitle1">{t("needAccount")}</Typography>
            <Button href={routes.signup}>{t("signUp")}</Button>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}

"use client";
import { Container, Stack, Divider, Typography, Button } from "@mui/material";

import Logo from "src/components/Logo";
import routes from "src/global/routes";
import SignupForm from "src/forms/SignupForm";
import { useTranslations } from "next-intl";

export default function SignUp() {
  const t = useTranslations("Auth");
  return (
    <Container maxWidth="xs">
      <Stack alignItems="center" justifyContent="center" minHeight="100vh">
        <Stack gap={2.5} width="100%">
          <Stack border={1} borderColor="divider" gap={2.5} sx={{ p: 4 }}>
            <Stack justifyContent="center" alignItems="center">
              <Logo />
            </Stack>
            <Divider />
            <Typography textAlign="center" variant="h3">
              {t("signUp")}
            </Typography>
            <SignupForm />
          </Stack>
          <Stack
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            py={3}
            border={1}
            borderColor="divider"
          >
            <Typography variant="subtitle1">{t("haveAccount")}</Typography>
            <Button href={routes.signin}>{t("signIn")}</Button>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}

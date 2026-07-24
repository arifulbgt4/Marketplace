"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Alert,
  Button,
  Container,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

function RecoveryForm() {
  const t = useTranslations("Auth");
  const token = useSearchParams().get("token") || "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const requestReset = async () => {
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/account/recovery/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || t("requestFailed"));
      setMessage(data.message);
      setPreviewUrl(data.previewUrl || "");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t("requestFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  const resetPassword = async () => {
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/account/recovery/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || t("resetFailed"));
      setMessage(t("resetComplete"));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t("resetFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h4">
          {token ? t("newPasswordTitle") : t("resetTitle")}
        </Typography>
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        {!token ? (
          <>
            <TextField
              label={t("email")}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <Button
              variant="contained"
              onClick={requestReset}
              disabled={submitting || !email.trim()}
            >
              {submitting ? t("sending") : t("sendReset")}
            </Button>
            {previewUrl && (
              <Button component="a" href={previewUrl} variant="outlined">
                {t("openResetLink")}
              </Button>
            )}
          </>
        ) : (
          <>
            <TextField
              label={t("newPassword")}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              helperText={t("passwordHint")}
              required
            />
            <TextField
              label={t("confirmPassword")}
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
            <Button
              variant="contained"
              onClick={resetPassword}
              disabled={
                submitting ||
                password.length < 12 ||
                password !== confirmPassword
              }
            >
              {submitting ? t("resetting") : t("resetPassword")}
            </Button>
          </>
        )}
        <Link href="/signin">{t("backToSignIn")}</Link>
      </Stack>
    </Paper>
  );
}

export default function ForgotPasswordPage() {
  const common = useTranslations("Common");
  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Suspense fallback={<Typography>{common("loading")}</Typography>}>
        <RecoveryForm />
      </Suspense>
    </Container>
  );
}

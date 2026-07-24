"use client";

import { useState } from "react";
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

export default function VerifyEmailPage() {
  const t = useTranslations("Auth");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resend = async () => {
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/account/verification/request", {
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

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Stack spacing={2}>
          <Typography variant="h4">{t("verifyTitle")}</Typography>
          <Typography color="text.secondary">
            {t("verifyDescription")}
          </Typography>
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label={t("email")}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <Button
            variant="contained"
            onClick={resend}
            disabled={submitting || !email.trim()}
          >
            {submitting ? t("sending") : t("resendLink")}
          </Button>
          {previewUrl && (
            <Button component="a" href={previewUrl} variant="outlined">
              {t("openDevLink")}
            </Button>
          )}
          <Link href="/signin">{t("backToSignIn")}</Link>
        </Stack>
      </Paper>
    </Container>
  );
}

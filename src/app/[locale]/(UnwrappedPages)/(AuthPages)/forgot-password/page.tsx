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

function RecoveryForm() {
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
      if (!response.ok) throw new Error(data.message || "Request failed");
      setMessage(data.message);
      setPreviewUrl(data.previewUrl || "");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Request failed");
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
      if (!response.ok) throw new Error(data.message || "Reset failed");
      setMessage("Password reset complete. You can now sign in.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Reset failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h4">
          {token ? "Choose a new password" : "Reset your password"}
        </Typography>
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        {!token ? (
          <>
            <TextField
              label="Email"
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
              {submitting ? "Sending..." : "Send reset instructions"}
            </Button>
            {previewUrl && (
              <Button component="a" href={previewUrl} variant="outlined">
                Open development reset link
              </Button>
            )}
          </>
        ) : (
          <>
            <TextField
              label="New password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              helperText="Use at least 12 characters"
              required
            />
            <TextField
              label="Confirm password"
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
              {submitting ? "Resetting..." : "Reset password"}
            </Button>
          </>
        )}
        <Link href="/signin">Back to sign in</Link>
      </Stack>
    </Paper>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Suspense fallback={<Typography>Loading...</Typography>}>
        <RecoveryForm />
      </Suspense>
    </Container>
  );
}

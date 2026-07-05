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

export default function VerifyEmailPage() {
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
      if (!response.ok) throw new Error(data.message || "Request failed");
      setMessage(data.message);
      setPreviewUrl(data.previewUrl || "");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Request failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Stack spacing={2}>
          <Typography variant="h4">Verify your email</Typography>
          <Typography color="text.secondary">
            Enter your signup email to receive a new one-use verification link.
          </Typography>
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Email"
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
            {submitting ? "Sending..." : "Resend verification link"}
          </Button>
          {previewUrl && (
            <Button component="a" href={previewUrl} variant="outlined">
              Open development verification link
            </Button>
          )}
          <Link href="/signin">Back to sign in</Link>
        </Stack>
      </Paper>
    </Container>
  );
}

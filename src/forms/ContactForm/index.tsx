"use client";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";
import type { FormEvent } from "react";
import { useState } from "react";

import type { ContactFormProps } from "./Types";

type SubmissionState =
  | { type: "idle" }
  | { type: "submitting" }
  | { type: "success"; reference: string }
  | { type: "error"; message: string };

const ContactForm = (_props: ContactFormProps) => {
  const [state, setState] = useState<SubmissionState>({ type: "idle" });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({ type: "submitting" });
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: "CONTACT",
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone") || undefined,
          subject: data.get("subject"),
          message: data.get("message"),
          context: { path: window.location.pathname },
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        reference?: string;
        message?: string;
      };
      if (!response.ok || !payload.reference) {
        throw new Error(payload.message || "Unable to send your request");
      }
      form.reset();
      setState({ type: "success", reference: payload.reference });
    } catch (error: unknown) {
      setState({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to send your request",
      });
    }
  };

  const submitting = state.type === "submitting";

  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={4}>
        {state.type === "success" ? (
          <Grid item xs={12}>
            <Alert severity="success" aria-live="polite">
              Your request was received. Reference: {state.reference}
            </Alert>
          </Grid>
        ) : null}
        {state.type === "error" ? (
          <Grid item xs={12}>
            <Alert severity="error" aria-live="assertive">
              {state.message}
            </Alert>
          </Grid>
        ) : null}
        <Grid item xs={12} md={6}>
          <TextField
            name="name"
            fullWidth
            label="Name"
            variant="standard"
            required
            size="small"
            disabled={submitting}
            inputProps={{ minLength: 2, maxLength: 100 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            type="email"
            name="email"
            fullWidth
            label="Your email"
            variant="standard"
            required
            size="small"
            disabled={submitting}
            inputProps={{ maxLength: 254 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name="subject"
            fullWidth
            label="Subject"
            variant="standard"
            required
            size="small"
            disabled={submitting}
            inputProps={{ minLength: 3, maxLength: 160 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            type="tel"
            name="phone"
            fullWidth
            label="Phone (optional)"
            variant="standard"
            size="small"
            disabled={submitting}
            inputProps={{ maxLength: 30 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="message"
            fullWidth
            multiline
            rows={5}
            label="How can we help?"
            variant="standard"
            required
            size="small"
            disabled={submitting}
            inputProps={{ minLength: 10, maxLength: 5000 }}
          />
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            type="submit"
            disabled={submitting}
            endIcon={
              submitting ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <KeyboardArrowRightIcon />
              )
            }
          >
            {submitting ? "Sending…" : "Send"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ContactForm;

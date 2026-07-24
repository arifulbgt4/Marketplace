"use client";

import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import type { FormEvent } from "react";
import { useState } from "react";

import type { ReportFormProps } from "./Types";

const REASONS = [
  "Listing in the wrong category",
  "Duplicate post",
  "Prohibited item",
  "Counterfeit item",
  "Irrelevant keywords",
  "Offensive content",
  "Suspicious activity",
] as const;

const ReportForm = ({ handleClose, listingId }: ReportFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const reason = String(data.get("reason") || "");

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: "LISTING_REPORT",
          name: data.get("name"),
          email: data.get("email"),
          subject: `Listing report: ${reason}`,
          message: data.get("message"),
          context: {
            resourceType: "listing",
            resourceId: listingId,
            path: window.location.pathname,
          },
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        reference?: string;
        message?: string;
      };
      if (!response.ok || !payload.reference) {
        throw new Error(payload.message || "Unable to submit this report");
      }
      setReference(payload.reference);
    } catch (submitError: unknown) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit this report",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (reference) {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">Report received</Typography>
        </Grid>
        <Grid item xs={12}>
          <Alert severity="success" aria-live="polite">
            Thank you. Your reference is {reference}.
          </Alert>
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={handleClose}>
            Done
          </Button>
        </Grid>
      </Grid>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">Report this listing</Typography>
        </Grid>
        {error ? (
          <Grid item xs={12}>
            <Alert severity="error" aria-live="assertive">
              {error}
            </Alert>
          </Grid>
        ) : null}
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            size="small"
            name="reason"
            label="Reason"
            required
            defaultValue=""
            disabled={submitting}
          >
            {REASONS.map((reason) => (
              <MenuItem key={reason} value={reason}>
                {reason}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size="small"
            name="name"
            label="Your name"
            required
            disabled={submitting}
            inputProps={{ minLength: 2, maxLength: 100 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size="small"
            type="email"
            name="email"
            label="Your email"
            required
            disabled={submitting}
            inputProps={{ maxLength: 254 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            minRows={4}
            name="message"
            label="Describe the issue"
            required
            disabled={submitting}
            inputProps={{ minLength: 10, maxLength: 5000 }}
          />
        </Grid>
        <Grid item xs={12} container justifyContent="space-between">
          <Button type="button" onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
                Submitting…
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ReportForm;

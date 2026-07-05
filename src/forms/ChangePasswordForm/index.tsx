"use client";
import { FC, useState } from "react";
import { Alert, Button, Grid, Typography } from "@mui/material";

import { Form as FinalForm } from "react-final-form";

import { TextField } from "src/components/Input";
import { ChangePasswordFormProps } from "./Types";

const INITIAL_VALUES = {
  currentPassword: "",
  newPassword: "",
  reTypePassword: "",
};

const ChangePasswordForm: FC<ChangePasswordFormProps> = () => {
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const onSubmitForm = async (values: typeof INITIAL_VALUES) => {
    setMessage(null);
    const response = await fetch("/api/account/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.reTypePassword,
      }),
    });
    const data = await response.json();
    setMessage(
      response.ok
        ? { type: "success", text: "Password changed. Please sign in again." }
        : { type: "error", text: data.message ?? "Password change failed." },
    );
  };

  return (
    <FinalForm
      onSubmit={onSubmitForm}
      initialValues={INITIAL_VALUES}
      render={({ handleSubmit, values, errors, submitting }) => {
        return (
          <form onSubmit={handleSubmit}>
            {message && (
              <Alert severity={message.type} sx={{ mb: 2 }}>
                {message.text}
              </Alert>
            )}
            <Grid
              container
              rowSpacing={2}
              justifyContent={{ xs: "space-between", md: "flex-start" }}
            >
              <Grid item xs={5} md={3} display="flex" alignItems="center">
                <Typography variant="h6">Current Password</Typography>
              </Grid>
              <Grid item xs={7}>
                <TextField
                  name="currentPassword"
                  size="small"
                  fullWidth
                  id="full-width"
                  label="Current Password"
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={5} md={3} display="flex" alignItems="center">
                <Typography variant="h6">Change Password</Typography>
              </Grid>
              <Grid item xs={7}>
                <TextField
                  name="newPassword"
                  size="small"
                  fullWidth
                  id="full-width"
                  label="Change Password"
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={5} md={3} display="flex" alignItems="center">
                <Typography variant="h6">Re Type Password</Typography>
              </Grid>
              <Grid item xs={7}>
                <TextField
                  name="reTypePassword"
                  fullWidth
                  size="small"
                  id="full-width"
                  label="Re Type Password"
                  variant="outlined"
                  required
                />
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid item xs={7} md={9} pt={2}>
                <Button variant="outlined" type="submit">
                  Update
                </Button>
              </Grid>
            </Grid>
          </form>
        );
      }}
    />
  );
};

export default ChangePasswordForm;

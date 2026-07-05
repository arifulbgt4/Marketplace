"use client";
import { useState } from "react";
import { Alert, Button, Grid, Typography } from "@mui/material";
import { Form as FinalForm } from "react-final-form";
import { TextField } from "src/components/Input";
import { UserSettingFormProps } from "./Types";

const UserSettingForm = ({ initialValues }: UserSettingFormProps) => {
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const onSubmitForm = async (
    values: UserSettingFormProps["initialValues"],
  ) => {
    setMessage(null);
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        phone: values.phone || null,
        image: values.image || null,
      }),
    });
    const data = await response.json();
    setMessage(
      response.ok
        ? { type: "success", text: "Profile updated." }
        : { type: "error", text: data.message ?? "Profile update failed." },
    );
  };

  return (
    <FinalForm
      onSubmit={onSubmitForm}
      initialValues={initialValues}
      render={({ handleSubmit, submitting }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} maxWidth={720}>
            {message && (
              <Grid item xs={12}>
                <Alert severity={message.type}>{message.text}</Alert>
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography variant="h5">Profile settings</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField name="name" label="Name" fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <TextField name="phone" label="Phone" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField name="image" label="Profile image URL" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" type="submit" disabled={submitting}>
                Save profile
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    />
  );
};

export default UserSettingForm;

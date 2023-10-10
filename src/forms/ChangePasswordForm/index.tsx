"use client";
import { FC } from "react";
import { Button, Grid, Typography } from "@mui/material";

import { Form as FinalForm } from "react-final-form";

import { TextField } from "src/components/Input";
import { ChangePasswordFormProps } from "./Types";

const INITIAL_VALUES = {
  currentPassword: "",
  newPassword: "",
  reTypePassword: "",
};

const ChangePasswordForm: FC<ChangePasswordFormProps> = () => {
  const onSubmitForm = async () => {};

  return (
    <FinalForm
      onSubmit={onSubmitForm}
      initialValues={INITIAL_VALUES}
      render={({ handleSubmit, values, errors, submitting }) => {
        return (
          <Grid container rowSpacing={5}>
            <Grid item xs={3}>
              <Typography variant="h6">Current Password</Typography>
            </Grid>
            <Grid item xs={8}>
              <TextField
                name="currentPassword"
                fullWidth
                id="full-width"
                label="Current Password"
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={3}>
              <Typography>Change Password</Typography>
            </Grid>
            <Grid item xs={8}>
              <TextField
                name="changePassword"
                fullWidth
                id="full-width"
                label="Change Password"
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6">Re Type Password</Typography>
            </Grid>
            <Grid item xs={8} container rowGap={2}>
              <TextField
                name="changePassword"
                fullWidth
                id="full-width"
                label="Change Password"
                variant="outlined"
                required
              />
              <Button variant="outlined" type="submit">
                Update
              </Button>
            </Grid>
          </Grid>
        );
      }}
    />
  );
};

export default ChangePasswordForm;

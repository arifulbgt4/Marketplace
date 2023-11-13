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
          <form onSubmit={handleSubmit}>
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
                  name="changePassword"
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

"use client";
import { FC } from "react";

import { Form as FinalForm } from "react-final-form";

import { Button, Grid, TextField, Typography } from "@mui/material";

import { CpItemProps } from "./Types";

const INITIAL_VALUES = {
  currentPassword: "",
  newPassword: "",
  reTypePassword: "",
};

const ChangePasswordForm = () => {
  const onSubmitForm = async () => {};

  return (
    <FinalForm
      onSubmit={onSubmitForm}
      initialValues={INITIAL_VALUES}
      render={({ handleSubmit, values, errors, submitting }) => {
        return (
          <Grid container rowSpacing={5}>
            <Items property="Current Password">
              <TextField
                name="currentPassword"
                fullWidth
                id="full-width"
                label="Current Password"
                variant="outlined"
                required
              />
            </Items>
            <Items property="Change Password">
              <TextField
                name="changePassword"
                fullWidth
                id="full-width"
                label="Change Password"
                variant="outlined"
                required
              />
            </Items>
            <Items property="Re Type Password">
              <TextField
                name="reTypePassword"
                fullWidth
                id="full-width"
                label="Re Type Password"
                variant="outlined"
                required
              />
            </Items>

            <Items property="">
              <Button variant="outlined" type="submit">
                Update
              </Button>
            </Items>
          </Grid>
        );
      }}
    />
  );
};

export default ChangePasswordForm;

const Items: FC<CpItemProps> = ({ property, children }) => {
  return (
    <>
      <Grid item xs={3}>
        <Typography variant="h6">{property}</Typography>
      </Grid>
      <Grid item xs={8}>
        {children}
      </Grid>
    </>
  );
};

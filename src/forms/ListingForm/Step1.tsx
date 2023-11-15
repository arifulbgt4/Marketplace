"use client";
import { FC } from "react";
import { Typography, Grid } from "@mui/material";
import { Form as FinalForm } from "react-final-form";

import { TextField } from "src/components/Input";

import { Step1Props } from "./Types";

const Step1: FC<Step1Props> = () => {
  const onSubmitForm = async () => {};

  return (
    <FinalForm
      onSubmit={onSubmitForm}
      render={({ handleSubmit, values, errors, submitting }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <Typography variant="h6" textAlign="center">
                  Basic Information
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="address"
                  label="Address"
                  placeholder="Location"
                  type="text"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography>Loaction Map</Typography>
              </Grid>
            </Grid>
          </form>
        );
      }}
    />
  );
};

export default Step1;

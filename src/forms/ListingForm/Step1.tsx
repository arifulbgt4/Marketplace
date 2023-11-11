"use client";
import { FC } from "react";
import { Typography, Grid } from "@mui/material";

import { TextField } from "src/components/Input";

import { Step1Props } from "./Types";

const Step1: FC<Step1Props> = () => {
  return (
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
  );
};

export default Step1;

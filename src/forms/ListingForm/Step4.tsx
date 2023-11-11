import { FC } from "react";
import { Grid, Typography } from "@mui/material";

import { TextField } from "src/components/Input";

import { Step4Props } from "./Types";

const Step4: FC<Step4Props> = () => {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h6" textAlign="center">
          Home Features
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField fullWidth name="size" label="Size" />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField fullWidth name="size" label="Size" />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField fullWidth name="size" label="Size" />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField fullWidth name="size" label="Size" />
      </Grid>
    </Grid>
  );
};

export default Step4;

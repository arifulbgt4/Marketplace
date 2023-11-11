import { FC } from "react";
import { Grid, Typography } from "@mui/material";

import { TextField } from "src/components/Input";

import { Step2Props } from "./Types";

const Step2: FC<Step2Props> = () => {
  return (
    <Grid container columnSpacing={3} rowSpacing={3} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h6" textAlign="center">
          Price Information
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <TextField fullWidth name="monthlyrent" label="Monthly Rent" />
      </Grid>
      <Grid item xs={6}>
        <TextField fullWidth name="monthlyrent" label="Monthly Rent" />
      </Grid>
      <Grid item xs={6}>
        <TextField fullWidth name="monthlyrent" label="Monthly Rent" />
      </Grid>
      <Grid item xs={6}>
        <TextField fullWidth name="monthlyrent" label="Monthly Rent" />
      </Grid>
    </Grid>
  );
};

export default Step2;

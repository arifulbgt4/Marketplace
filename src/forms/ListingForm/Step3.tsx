import { FC } from "react";
import { Grid, Typography } from "@mui/material";

import { TextField } from "src/components/Input";

import { Step3Props } from "./Types";

const Step3: FC<Step3Props> = () => {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h6" textAlign="center">
          Contact Method
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField fullWidth name="emailaddress" label="Email Address" />
      </Grid>
    </Grid>
  );
};

export default Step3;

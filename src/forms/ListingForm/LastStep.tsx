import React, { FC } from "react";
import { Grid, Typography } from "@mui/material";

import { LastStepProps } from "./Types";

const LastStep: FC<LastStepProps> = () => {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h6" textAlign="center">
          Completed
        </Typography>
      </Grid>
    </Grid>
  );
};

export default LastStep;

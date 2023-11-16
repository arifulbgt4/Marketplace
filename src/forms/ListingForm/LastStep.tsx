import React, { FC } from "react";
import { Grid, Typography } from "@mui/material";

import { LastStepProps } from "./Types";

const LastStep: FC<LastStepProps> = () => {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h6" textAlign="center">
          Upload Image
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        display="flex"
        flexDirection="row"
        justifyContent="center"
        flexWrap="wrap"
        gap={2}
      >
        <Typography>Hey</Typography>
      </Grid>
    </Grid>
  );
};

export default LastStep;

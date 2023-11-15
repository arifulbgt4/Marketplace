import { FC } from "react";
import { Box, Grid, Typography } from "@mui/material";

import Staper from "./Staper";

import { ListingFormProps } from "./Types";

const ListingForm: FC<ListingFormProps> = () => {
  return (
    <Box p={5}>
      <Grid container rowSpacing={9}>
        <Grid item xs={12}>
          <Typography variant="h4" textAlign="center">
            Add a New Listing
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Staper />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ListingForm;

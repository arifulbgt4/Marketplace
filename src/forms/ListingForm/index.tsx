"use client";
import { FC } from "react";
import { Form as FinalForm } from "react-final-form";
import { Box, Grid, Typography } from "@mui/material";

import Staper from "./Staper";

import { ListingFormProps } from "./Types";

const ListingForm: FC<ListingFormProps> = () => {
  const onSubmitForm = async () => {};
  return (
    <Box p={5}>
      <FinalForm
        onSubmit={onSubmitForm}
        render={({ handleSubmit, values, errors, submitting }) => {
          return (
            <form onSubmit={handleSubmit}>
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
            </form>
          );
        }}
      />
    </Box>
  );
};

export default ListingForm;

"use client";
import { FC } from "react";
import { Form as FinalForm } from "react-final-form";
import { Grid, Paper, Typography } from "@mui/material";

import VerticalStepper from "src/widgets/VerticalStepper";

import { ListingFormProps } from "./Types";

const ListingForm: FC<ListingFormProps> = () => {
  const onSubmitForm = async () => {};
  return (
    <FinalForm
      onSubmit={onSubmitForm}
      render={({ handleSubmit, values, errors, submitting }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Grid container>
              <Grid item xs={12}>
                <Typography>Add Item</Typography>
              </Grid>
              <Grid item xs={12}>
                <VerticalStepper />
              </Grid>
            </Grid>
          </form>
        );
      }}
    />
  );
};

export default ListingForm;

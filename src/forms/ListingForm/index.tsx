"use client";
import { FC } from "react";
import { Form as FinalForm } from "react-final-form";
import { Container, Grid, Typography } from "@mui/material";
import ListingPreview from "src/widgets/ListingPreview";

import Staper from "./Staper";

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
              <Grid item xs={7}>
                <Container maxWidth="md">
                  <ListingPreview values={values} />
                </Container>
              </Grid>
              <Grid
                item
                xs={5}
                sx={(theme) => ({
                  height: "fit-content",
                  position: "sticky",
                  top: 0,
                  background: theme.palette.background.paper,
                })}
              >
                <Staper />
              </Grid>
            </Grid>
          </form>
        );
      }}
    />
  );
};

export default ListingForm;

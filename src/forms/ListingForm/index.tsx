"use client";
import { FC } from "react";
import { Form as FinalForm } from "react-final-form";
import { Container, Grid, Hidden } from "@mui/material";

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
              <Hidden mdDown>
                <Grid item md={7}>
                  <Container maxWidth="md">
                    <ListingPreview values={values} />
                  </Container>
                </Grid>
              </Hidden>
              <Grid
                item
                xs={12}
                md={5}
                sx={(theme) => ({
                  height: "fit-content",
                  position: "sticky",
                  top: 0,
                  background: theme.palette.background.paper,
                  boxShadow: 1,
                })}
              >
                <Staper errors={errors} submitting={submitting} />
              </Grid>
            </Grid>
          </form>
        );
      }}
    />
  );
};

export default ListingForm;

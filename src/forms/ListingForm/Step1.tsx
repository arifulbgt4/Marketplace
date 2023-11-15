"use client";
import { FC } from "react";
import { Typography, Grid, MobileStepper, Button, Box } from "@mui/material";
import { Form as FinalForm } from "react-final-form";

import { TextField } from "src/components/Input";

import { Step1Props } from "./Types";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

const Step1: FC<Step1Props> = ({
  activeStep,
  handleNext,
  handleBack,
  theme,
}) => {
  const onSubmitForm = async () => {};

  return (
    <FinalForm
      onSubmit={onSubmitForm}
      render={({ handleSubmit, values, errors, submitting }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <Typography variant="h6" textAlign="center">
                  Basic Information
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="address"
                  label="Address"
                  placeholder="Location"
                  type="text"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography>Loaction Map</Typography>
              </Grid>
            </Grid>
            <Box maxWidth={400} marginX="auto" pt={3}>
              <MobileStepper
                variant="progress"
                steps={5}
                position="static"
                activeStep={activeStep}
                nextButton={
                  <Button
                    size="small"
                    onClick={handleNext}
                    disabled={activeStep === 4}
                  >
                    Next
                    {theme === "rtl" ? (
                      <KeyboardArrowLeft />
                    ) : (
                      <KeyboardArrowRight />
                    )}
                  </Button>
                }
                backButton={
                  <Button
                    size="small"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                  >
                    Back
                  </Button>
                }
              />
            </Box>
          </form>
        );
      }}
    />
  );
};

export default Step1;

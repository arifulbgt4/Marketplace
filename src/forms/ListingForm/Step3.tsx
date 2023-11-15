import { FC } from "react";
import { Form as FinalForm } from "react-final-form";
import {
  Grid,
  Typography,
  Stack,
  Box,
  FormControlLabel,
  Checkbox,
  Button,
  MobileStepper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { TextField } from "src/components/Input";

import { Step3Props } from "./Types";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

const Step3: FC<Step3Props> = ({
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
                  Contact Method
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Stack
                  direction="row"
                  flexWrap="wrap"
                  justifyContent="space-between"
                >
                  <Box>
                    <FormControlLabel
                      value="end"
                      control={<Checkbox name="phone" />}
                      label="Phone"
                      labelPlacement="end"
                    />
                  </Box>
                  <Box>
                    <FormControlLabel
                      value="end"
                      control={<Checkbox name="email" />}
                      label="Email"
                      labelPlacement="end"
                    />
                  </Box>
                  <Box>
                    <FormControlLabel
                      value="end"
                      control={<Checkbox name="text" />}
                      label="Text"
                      labelPlacement="end"
                    />
                  </Box>
                </Stack>
              </Grid>
              <Grid
                item
                xs={12}
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="phonenumber"
                    label="Phone Number"
                  />
                </Grid>
                <Grid item xs={3}>
                  <Button startIcon={<AddIcon />} size="medium">
                    Add Another
                  </Button>
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="emailaddress"
                    label="Email Address"
                  />
                </Grid>
                <Grid item xs={3}>
                  <Button startIcon={<AddIcon />} size="medium">
                    Add Another
                  </Button>
                </Grid>
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

export default Step3;

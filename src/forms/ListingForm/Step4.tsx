import { FC } from "react";
import { Form as FinalForm } from "react-final-form";
import {
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  Input,
  MenuItem,
  InputAdornment,
  Button,
  MobileStepper,
  Box,
} from "@mui/material";

import { TextField } from "src/components/Input";

import { Step4Props } from "./Types";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

const Step4: FC<Step4Props> = ({
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
                <FormControl sx={{ m: 1 }} variant="standard" fullWidth>
                  <TextField
                    fullWidth
                    name="aboutproperty"
                    label="Property Details"
                    multiline
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} container spacing={5}>
                <Grid item xs={4}>
                  <FormControl sx={{ m: 1 }} variant="standard" fullWidth>
                    <TextField
                      variant="outlined"
                      fullWidth
                      name="bedroom"
                      label="Bedroom"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl sx={{ m: 1 }} variant="standard" fullWidth>
                    <TextField fullWidth name="bathroom" label="Bathroom" />
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    sx={{ m: 1 }}
                    name="size"
                    label="Size"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography>squre feet</Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12} container spacing={5}>
                <Grid item xs={4}>
                  <FormControl sx={{ m: 1 }} variant="standard" fullWidth>
                    <TextField fullWidth name="smoking" label="smoking" />
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl sx={{ m: 1 }} variant="standard" fullWidth>
                    <TextField fullWidth name="pet" label="Pet" />
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl sx={{ m: 1 }} variant="standard" fullWidth>
                    <TextField fullWidth name="parking" label="Parking" />
                  </FormControl>
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

export default Step4;

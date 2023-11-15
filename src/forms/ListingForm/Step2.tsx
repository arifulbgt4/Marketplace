import { FC } from "react";
import { Form as FinalForm } from "react-final-form";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  MobileStepper,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import { TextField } from "src/components/Input";
import CalendarComp from "src/widgets/CalendarComp";

import { Step2Props } from "./Types";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

const Step2: FC<Step2Props> = ({
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
                  Price Information
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <TextField name="category" label="Category" />
                </FormControl>
              </Grid>
              <Grid item xs={12} container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <TextField
                      name="monthlyrent"
                      label="Monthly Rent"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoneyIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <TextField
                      name="sequritydeposit"
                      label="Sequrity Deposit"
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid item xs={12} container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <CalendarComp />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <TextField name="range" label="Range" />
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

export default Step2;

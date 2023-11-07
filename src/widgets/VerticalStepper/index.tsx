"use client";
import { FC, useState } from "react";
import {
  Grid,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  Typography,
  FormControl,
  MenuItem,
  InputLabel,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import { Select, TextField } from "src/components/Input";

import { VerticalStepperProps } from "./Types";
import CalendarComp from "../CalendarComp/index";

const VerticalStepper: FC<VerticalStepperProps> = () => {
  const [activeStep, setActiveStep] = useState(0);
  console.log(activeStep);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step>
          <StepLabel
            optional={
              activeStep === 0 ? <Typography>step pending</Typography> : null
            }
          >
            <Typography>Basic Information</Typography>
            {activeStep > 0 ? <Typography>complete</Typography> : null}
          </StepLabel>
          <StepContent>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                name="address"
                label="Address"
                placeholder="Location"
                type="text"
              />
              <Typography>Loaction Map</Typography>
              <div>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Continue
                </Button>
                <Button
                  onClick={handleBack}
                  sx={{ mt: 1, mr: 1 }}
                  disabled={true}
                >
                  Back
                </Button>
              </div>
            </Box>
          </StepContent>
        </Step>
        <Step>
          <StepLabel
            optional={
              activeStep === 1 ? <Typography>pending</Typography> : null
            }
          >
            <Typography>Price Information</Typography>
            {activeStep > 1 ? (
              <Typography variant="caption">complete</Typography>
            ) : null}
          </StepLabel>
          <StepContent>
            <PriceInformation />
            <Box sx={{ mb: 2 }}>
              <Box pt={5}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Continue
                </Button>
                <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                  Back
                </Button>
              </Box>
            </Box>
          </StepContent>
        </Step>
        <Step>
          <StepLabel
            optional={
              activeStep === 2 ? <Typography>step pending</Typography> : null
            }
          >
            <Typography>Contact Method</Typography>
            {activeStep > 2 ? (
              <Typography variant="caption">complete</Typography>
            ) : null}
          </StepLabel>
          <StepContent>
            <Typography>description</Typography>
            <Box sx={{ mb: 2 }}>
              <div>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Continue
                </Button>
                <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                  Back
                </Button>
              </div>
            </Box>
          </StepContent>
        </Step>
        <Step>
          <StepLabel
            optional={
              activeStep === 3 ? <Typography>step pending</Typography> : null
            }
          >
            <Typography>Home Features</Typography>
            {activeStep > 3 ? (
              <Typography variant="caption">complete</Typography>
            ) : null}
          </StepLabel>
          <StepContent>
            <Typography>description</Typography>
            <Box sx={{ mb: 2 }}>
              <div>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Continue
                </Button>
                <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                  Back
                </Button>
              </div>
            </Box>
          </StepContent>
        </Step>
        <Step>
          <StepLabel
            optional={
              activeStep === 4 ? <Typography>step pending</Typography> : null
            }
          >
            <Typography>Upload Images</Typography>
            {activeStep > 4 ? <Typography>complete</Typography> : null}
          </StepLabel>
          <StepContent>
            <Typography>description</Typography>
            <Box sx={{ mb: 2 }}>
              <div>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                >
                  Continue
                </Button>
                <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                  Back
                </Button>
              </div>
            </Box>
          </StepContent>
        </Step>
      </Stepper>

      {activeStep === 5 && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  );
};

const PriceInformation = () => {
  return (
    <Grid container spacing={5}>
      <Grid item xs={6}>
        <FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
          <InputLabel>category</InputLabel>
          <Select name="category" input={<OutlinedInput label="category" />}>
            <MenuItem value="">
              <em>None Selected</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} container spacing={5}>
        <Grid item xs={6}>
          <FormControl fullWidth sx={{ m: 1 }}>
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
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel id="demo-simple-select-label">
              Sequrity Deposit
            </InputLabel>
            <Select
              name="sdeposit"
              input={<OutlinedInput label="Sequrity Deposit" />}
            >
              <MenuItem value="1">1/2 Month</MenuItem>
              <MenuItem value="2">Ten</MenuItem>
              <MenuItem value="3">Twenty</MenuItem>
              <MenuItem value="4">Thirty</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid item xs={12} container spacing={5}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <CalendarComp />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Lease term</InputLabel>
            <Select
              fullWidth
              name="sdeposit"
              input={<OutlinedInput label="lease term" />}
            >
              <MenuItem value="1">long term</MenuItem>
              <MenuItem value="2">short term</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default VerticalStepper;

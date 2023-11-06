"use client";
import { FC, useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  Typography,
} from "@mui/material";

import { TextField } from "src/components/Input";

import { VerticalStepperProps } from "./Types";

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
    <Box sx={{ maxWidth: 600 }}>
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

export default VerticalStepper;

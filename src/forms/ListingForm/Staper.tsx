"use client";
import { FC, useState } from "react";
import { Form as FinalForm } from "react-final-form";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

import Step1 from "./Step1";
import Step3 from "./Step3";
import Step2 from "./Step2";
import Step4 from "./Step4";
import Step5 from "./Step5";

import { StaperProps } from "./Types";

const Staper: FC<StaperProps> = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const onSubmitForm = async () => {};
  return (
    <Box>
      {activeStep === 0 ? (
        <Step1 />
      ) : activeStep === 1 ? (
        <Step2 />
      ) : activeStep === 2 ? (
        <Step3 />
      ) : activeStep === 3 ? (
        <Step4 />
      ) : (
        <Step5 />
      )}

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
              {theme.direction === "rtl" ? (
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
    </Box>
  );
};

export default Staper;

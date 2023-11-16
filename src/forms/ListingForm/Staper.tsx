"use client";
import { FC, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

import { StaperProps } from "./Types";
import LastStep from "./LastStep";

const Staper: FC<StaperProps> = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(1);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box minHeight={`calc(100vh - 64px)`} position="relative">
      {activeStep === 1 && <Step1 />}
      {activeStep === 2 && <Step2 />}
      {activeStep === 3 && <Step3 />}
      {activeStep === 4 && <LastStep />}

      <Box
        marginX="auto"
        pt={3}
        position="absolute"
        bottom={40}
        left={0}
        right={0}
      >
        <MobileStepper
          variant="progress"
          steps={5}
          position="static"
          activeStep={activeStep}
          style={{ background: theme.palette.background.paper }}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === 4}
            >
              Next
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 1}
            >
              <KeyboardArrowLeft />
              Back
            </Button>
          }
        />
      </Box>
    </Box>
  );
};

export default Staper;

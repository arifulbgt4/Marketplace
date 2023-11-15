"use client";
import { FC, useState } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

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

  return (
    <Box>
      {activeStep === 0 ? (
        <Step1
          activeStep={activeStep}
          handleNext={handleNext}
          handleBack={handleBack}
          theme={theme.direction}
        />
      ) : activeStep === 1 ? (
        <Step2
          activeStep={activeStep}
          handleNext={handleNext}
          handleBack={handleBack}
          theme={theme.direction}
        />
      ) : activeStep === 2 ? (
        <Step3
          activeStep={activeStep}
          handleNext={handleNext}
          handleBack={handleBack}
          theme={theme.direction}
        />
      ) : activeStep === 3 ? (
        <Step4
          activeStep={activeStep}
          handleNext={handleNext}
          handleBack={handleBack}
          theme={theme.direction}
        />
      ) : (
        <Step5
          activeStep={activeStep}
          handleNext={handleNext}
          handleBack={handleBack}
          theme={theme.direction}
        />
      )}
    </Box>
  );
};

export default Staper;

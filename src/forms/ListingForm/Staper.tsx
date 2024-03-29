"use client";
import { FC, useMemo, useState } from "react";
import { Box, Stack, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import { ArrowBackIosSharp, ArrowForwardIosSharp } from "@mui/icons-material";

import Logo from "src/components/Logo";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import LastStep from "./LastStep";

import { StaperProps } from "./Types";

const Staper: FC<StaperProps> = ({ errors, submitting }) => {
  const [activeStep, setActiveStep] = useState(1);
  const theme = useTheme();

  const handleNext = () => setActiveStep((prevState) => ++prevState);

  const handleBack = () => setActiveStep((prevState) => --prevState);

  const checkStep1 = useMemo(() => {
    if (errors?.title === undefined) return false;
    return true;
  }, [errors]);

  return (
    <Box position="relative">
      <Stack
        height={`100vh`}
        sx={{
          overflowY: "auto",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          position="sticky"
          py={3}
          px={3}
          mb={2}
          top={0}
          sx={(theme) => ({
            boxShadow: 1,
            background: theme.palette.background.paper,
            zIndex: 9,
          })}
        >
          <Logo iconOnly />
          <Typography variant="h5">Create a listing</Typography>
          <Button
            variant="outlined"
            type="submit"
            color="inherit"
            endIcon={<ArrowForwardIosSharp />}
            disabled={submitting || checkStep1}
          >
            Save & exit
          </Button>
        </Stack>
        <Box p={3} mb={10}>
          {activeStep === 1 && <Step1 />}
          {activeStep === 2 && <Step2 />}
          {activeStep === 3 && <Step3 />}
          {activeStep === 4 && <LastStep />}
        </Box>
      </Stack>

      <Box marginX="auto" position="absolute" bottom={0} left={0} right={0}>
        <MobileStepper
          variant="progress"
          steps={5}
          position="static"
          activeStep={activeStep}
          style={{
            background: theme.palette.background.paper,
            padding: theme.spacing(3),
            paddingTop: theme.spacing(2),
          }}
          nextButton={
            <Button
              size="large"
              variant="rounded"
              onClick={handleNext}
              disabled={checkStep1 || activeStep === 4}
              endIcon={<ArrowForwardIosSharp fontSize="small" />}
            >
              Next
            </Button>
          }
          backButton={
            <Button
              size="large"
              variant="rounded"
              onClick={handleBack}
              disabled={activeStep === 1}
              startIcon={<ArrowBackIosSharp fontSize="small" />}
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

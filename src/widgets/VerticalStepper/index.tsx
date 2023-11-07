"use client";
import { FC, useState } from "react";
import Image from "next/image";
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
  FormControlLabel,
  Stack,
  Input,
  IconButton,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import { Checkbox, Select, TextField, UploadImage } from "src/components/Input";
import CalendarComp from "../CalendarComp/index";

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
            <ContactMethod />
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
              activeStep === 3 ? <Typography>step pending</Typography> : null
            }
          >
            <Typography>Home Features</Typography>
            {activeStep > 3 ? (
              <Typography variant="caption">complete</Typography>
            ) : null}
          </StepLabel>
          <StepContent>
            <HomeFeatures />
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
              activeStep === 4 ? <Typography>step pending</Typography> : null
            }
          >
            <Typography>Upload Images</Typography>
            {activeStep > 4 ? <Typography>complete</Typography> : null}
          </StepLabel>
          <StepContent>
            <UploadImages />
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

const ContactMethod = () => {
  return (
    <Grid container gap={5}>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between">
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
          <TextField fullWidth name="phonenumber" label="Phone Number" />
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
          <TextField fullWidth name="emailaddress" label="Email Address" />
        </Grid>
        <Grid item xs={3}>
          <Button startIcon={<AddIcon />} size="medium">
            Add Another
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

const HomeFeatures = () => {
  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <FormControl sx={{ m: 1 }} variant="standard" fullWidth>
          <InputLabel htmlFor="demo-customized-textbox">
            About Property
          </InputLabel>
          <Select
            fullWidth
            name="aboutproperty"
            label="Property Details"
            multiline
            input={<Input />}
          >
            <MenuItem>item1</MenuItem>
            <MenuItem>item1</MenuItem>
            <MenuItem>item1</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} container spacing={5}>
        <Grid item xs={4}>
          <FormControl sx={{ m: 1 }} variant="standard" fullWidth>
            <InputLabel htmlFor="demo-customized-textbox">Bedroom</InputLabel>
            <Select fullWidth name="bedroom" input={<Input />} label="Bedroom">
              <MenuItem>item1</MenuItem>
              <MenuItem>item1</MenuItem>
              <MenuItem>item1</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl sx={{ m: 1 }} variant="standard" fullWidth>
            <InputLabel htmlFor="demo-customized-textbox">Bathroom</InputLabel>
            <Select
              fullWidth
              name="bathroom"
              input={<Input />}
              label="Bathroom"
            >
              <MenuItem>item1</MenuItem>
              <MenuItem>item1</MenuItem>
              <MenuItem>item1</MenuItem>
            </Select>
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
            <InputLabel htmlFor="demo-customized-textbox">Smoking</InputLabel>
            <Select fullWidth name="smoking" input={<Input />} label="smoking">
              <MenuItem>item1</MenuItem>
              <MenuItem>item1</MenuItem>
              <MenuItem>item1</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl sx={{ m: 1 }} variant="standard" fullWidth>
            <InputLabel htmlFor="demo-customized-textbox">Pet</InputLabel>
            <Select fullWidth name="pet" input={<Input />} label="Pet">
              <MenuItem>item1</MenuItem>
              <MenuItem>item1</MenuItem>
              <MenuItem>item1</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl sx={{ m: 1 }} variant="standard" fullWidth>
            <InputLabel htmlFor="demo-customized-textbox">Parking</InputLabel>
            <Select fullWidth name="parking" input={<Input />} label="Parking">
              <MenuItem>item1</MenuItem>
              <MenuItem>item1</MenuItem>
              <MenuItem>item1</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Grid>
  );
};

const UploadImages = () => {
  return (
    <Grid container>
      <Grid item>
        <UploadImage
          multiple
          name="image"
          previewRender={(src, onRemove) => {
            return src.map((data, index) => {
              return (
                <Stack key={index} position="relative">
                  <Box sx={{ ":hover": {} }}>
                    <Image src={data} width={100} height={100} alt="upload" />
                  </Box>
                  <IconButton
                    color="error"
                    onClick={() => onRemove(index)}
                    sx={{ position: "absolute", width: 100 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              );
            });
          }}
        >
          <Stack
            direction="row"
            p={1}
            bgcolor="gray"
            borderRadius={2}
            width={100}
            sx={{ cursor: "pointer" }}
          >
            <AddIcon />
          </Stack>
        </UploadImage>
      </Grid>
    </Grid>
  );
};

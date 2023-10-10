"use client";
import { FC } from "react";
import {
  Grid,
  Typography,
  FormControl,
  Button,
  FormControlLabel,
  Radio,
} from "@mui/material";

import { Form as FinalForm } from "react-final-form";
import { FormApi } from "final-form";

import { RadioGroup, TextField } from "src/components/Input";

import { UserSettingFormProps } from "./Types";

const INITIAL_VALUES = {
  firstName: "",
  lastName: "",
  emailAdress: "",
  number: "",
  adress: "",
  profileText: "",
};
const UserSettingForm: FC<UserSettingFormProps> = () => {
  const onSubmitForm = async () => {};

  return (
    <FinalForm
      onSubmit={onSubmitForm}
      initialValues={INITIAL_VALUES}
      render={({ handleSubmit, values, errors, submitting }) => {
        return (
          <Grid container rowSpacing={5}>
            <Grid item xs={3}>
              <Typography variant="h6">First Name</Typography>
            </Grid>
            <Grid item xs={8}>
              <TextField
                name="firstName"
                fullWidth
                id="full-width"
                label="First Name"
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6">Last Name</Typography>
            </Grid>
            <Grid item xs={8}>
              <TextField
                name="lastName"
                fullWidth
                id="full-width"
                label="Last Name"
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6">Email Adress</Typography>
            </Grid>
            <Grid item xs={8}>
              <TextField
                type="email"
                name="emailAdress"
                fullWidth
                id="full-width"
                label="Email"
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6">Your Numbers</Typography>
            </Grid>
            <Grid item xs={8}>
              <TextField
                name="number"
                fullWidth
                id="full-width"
                label="Your Numbers"
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6">Adress</Typography>
            </Grid>
            <Grid item xs={8}>
              <TextField
                name="adress"
                fullWidth
                id="full-width"
                label="Adress"
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6">Country</Typography>
            </Grid>
            <Grid item xs={8}>
              <TextField
                name="country"
                fullWidth
                id="full-width"
                label="Country"
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6">Profile Text</Typography>
            </Grid>
            <Grid item xs={8}>
              <TextField
                name="profileText"
                fullWidth
                multiline
                rows={4}
                id="full-width"
                label="Profile Text"
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6">Gender</Typography>
            </Grid>
            <Grid item xs={8} container rowSpacing={2}>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="female"
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="Other"
                  />
                </RadioGroup>
              </FormControl>
              <Grid item xs={12}>
                <Button variant="outlined" type="submit">
                  Update
                </Button>
              </Grid>
            </Grid>
          </Grid>
        );
      }}
    />
  );
};

export default UserSettingForm;

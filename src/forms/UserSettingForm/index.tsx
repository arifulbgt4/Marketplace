"use client";
import { FC } from "react";
import {
  Grid,
  Box,
  Typography,
  TextField,
  FormControl,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

import { Form as FinalForm } from "react-final-form";
import { FormApi } from "final-form";

import { ItemsProps, UserSettingFormProps } from "./Types";

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
            <Items property="First Name">
              <TextField
                name="firstName"
                fullWidth
                id="full-width"
                label="First Name"
                variant="outlined"
                required
              />
            </Items>
            <Items property="Last Name">
              <TextField
                name="lastName"
                fullWidth
                id="full-width"
                label="Last Name"
                variant="outlined"
                required
              />
            </Items>
            <Items property="Email Adress">
              <TextField
                type="email"
                name="emailAdress"
                fullWidth
                id="full-width"
                label="Email"
                variant="outlined"
                required
              />
            </Items>
            <Items property="Your Numbers">
              <TextField
                name="number"
                fullWidth
                id="full-width"
                label="Your Numbers"
                variant="outlined"
                required
              />
            </Items>
            <Items property="Adress">
              <TextField
                name="adress"
                fullWidth
                id="full-width"
                label="Adress"
                variant="outlined"
                required
              />
            </Items>
            <Items property="Country">
              <TextField
                name="country"
                fullWidth
                id="full-width"
                label="Country"
                variant="outlined"
                required
              />
            </Items>
            <Items property="Profile Text">
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
            </Items>
            <Items property="Gender">
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
            </Items>
            <Items property="">
              <Button variant="outlined" type="submit">
                Update
              </Button>
            </Items>
          </Grid>
        );
      }}
    />
  );
};

export default UserSettingForm;

const Items: FC<ItemsProps> = ({ property, children }) => {
  return (
    <>
      <Grid item xs={3}>
        <Typography variant="h6">{property}</Typography>
      </Grid>
      <Grid item xs={8}>
        {children}
      </Grid>
    </>
  );
};

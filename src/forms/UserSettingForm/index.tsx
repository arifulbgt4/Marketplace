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
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item container xs={12} columnSpacing={5}>
                <Grid item xs={3}>
                  <Typography variant="h6">First Name</Typography>
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    name="firstName"
                    fullWidth
                    id="full-width"
                    label="First Name"
                    variant="outlined"
                    required
                  />
                </Grid>
              </Grid>
              <Grid item container xs={12} columnSpacing={5}>
                <Grid item xs={3}>
                  <Typography variant="h6">Last Name</Typography>
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    name="lastName"
                    fullWidth
                    id="full-width"
                    label="Last Name"
                    variant="outlined"
                    required
                  />
                </Grid>
              </Grid>
              <Grid item container xs={12} columnSpacing={5}>
                <Grid item xs={3}>
                  <Typography variant="h6">Email Adress</Typography>
                </Grid>
                <Grid item xs={7}>
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
              </Grid>
              <Grid item container xs={12} columnSpacing={5}>
                <Grid item xs={3}>
                  <Typography variant="h6">Your Numbers</Typography>
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    name="number"
                    fullWidth
                    id="full-width"
                    label="Your Numbers"
                    variant="outlined"
                    required
                  />
                </Grid>
              </Grid>
              <Grid item container xs={12} columnSpacing={5}>
                <Grid item xs={3}>
                  <Typography variant="h6">Adress</Typography>
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    name="adress"
                    fullWidth
                    id="full-width"
                    label="Adress"
                    variant="outlined"
                    required
                  />
                </Grid>
              </Grid>
              <Grid item container xs={12} columnSpacing={5}>
                <Grid item xs={3}>
                  <Typography variant="h6">Country</Typography>
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    name="country"
                    fullWidth
                    id="full-width"
                    label="Country"
                    variant="outlined"
                    required
                  />
                </Grid>
              </Grid>
              <Grid item container xs={12} columnSpacing={5}>
                <Grid item xs={3}>
                  <Typography variant="h6">Profile Text</Typography>
                </Grid>
                <Grid item xs={7}>
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
              </Grid>
              <Grid item container xs={12} columnSpacing={5}>
                <Grid item xs={3}>
                  <Typography variant="h6">Gender</Typography>
                </Grid>
                <Grid item xs={7} container rowSpacing={2}>
                  <Grid item xs={12} pl={1}>
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
                          checked
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="outlined" type="submit">
                      Save / UPDATE
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
        );
      }}
    />
  );
};

export default UserSettingForm;

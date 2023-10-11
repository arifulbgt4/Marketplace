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

import { ContactFormProps } from "./Types";

const INITIAL_VALUES = {
  name: "",
  email: "",
  password: "",
  subject: "",
  message: "",
};
const ContactForm: FC<ContactFormProps> = () => {
  const onSubmitForm = async () => {};

  return (
    <FinalForm
      onSubmit={onSubmitForm}
      initialValues={INITIAL_VALUES}
      render={({ handleSubmit, values, errors, submitting }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Grid container rowGap={5}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  fullWidth
                  id="full-width"
                  label="Your name"
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  type="email"
                  name="email"
                  fullWidth
                  id="full-width"
                  label="Your Email"
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="subect"
                  fullWidth
                  id="full-width"
                  label="Subject"
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="message"
                  fullWidth
                  multiline
                  rows={4}
                  id="full-width"
                  label="message"
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Button variant="outlined" type="submit">
                  Update
                </Button>
              </Grid>
            </Grid>
          </form>
        );
      }}
    />
  );
};

export default ContactForm;

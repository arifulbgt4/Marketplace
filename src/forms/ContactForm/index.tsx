"use client";
import { FC } from "react";
import { Form as FinalForm } from "react-final-form";
import { FormApi } from "final-form";
import { Grid, Button } from "@mui/material";

import { TextField } from "src/components/Input";

import { ContactFormProps } from "./Types";

const INITIAL_VALUES = {
  name: "",
  email: "",
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
            <Grid container rowSpacing={2}>
              <Grid item xs={12}>
                <TextField
                  type="email"
                  name="email"
                  fullWidth
                  id="email"
                  label="Your Email"
                  variant="filled"
                  required
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="subect"
                  fullWidth
                  id="subject"
                  label="Subject"
                  variant="filled"
                  size="small"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="message"
                  fullWidth
                  multiline
                  rows={5}
                  id="message"
                  label="message"
                  variant="filled"
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="contained" type="submit">
                  Send
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

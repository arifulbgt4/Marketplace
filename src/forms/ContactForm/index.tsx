"use client";
import { FC } from "react";
import { Form as FinalForm } from "react-final-form";
import { Grid, Button } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

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
            <Grid container spacing={6}>
              <Grid item xs={12} md={6}>
                <TextField
                  type="text"
                  name="name"
                  fullWidth
                  id="name"
                  label="Name"
                  variant="standard"
                  required
                  size="small"
                  sx={{ label: { fontWeight: 400 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  type="email"
                  name="email"
                  fullWidth
                  id="email"
                  label="Your Email"
                  variant="standard"
                  required
                  size="small"
                  sx={{ label: { fontWeight: 400 } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  name="subect"
                  fullWidth
                  id="subject"
                  label="Subject"
                  variant="standard"
                  size="small"
                  required
                  sx={{ label: { fontWeight: 400 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  type="number"
                  name="number"
                  fullWidth
                  id="number"
                  label="Number"
                  variant="standard"
                  required
                  size="small"
                  sx={{ label: { fontWeight: 400 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="message"
                  fullWidth
                  multiline
                  rows={5}
                  id="message"
                  label="Hello Iam Intrested in.."
                  variant="standard"
                  required
                  size="small"
                  sx={{ label: { fontWeight: 500 } }}
                />
              </Grid>
              <Grid item xs={12} display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  type="submit"
                  endIcon={<KeyboardArrowRightIcon />}
                >
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

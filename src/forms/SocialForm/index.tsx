"use client";
import { FC } from "react";

import { Form as FinalForm } from "react-final-form";

import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

import { SItemProps, SocilalFormProps } from "./Types";

const INITIAL_VALUES = {
  facebook: "",
  linkedIn: "",
  instragram: "",
  twitter: "",
};

const SocilalForm: FC<SocilalFormProps> = () => {
  const onSubmitForm = async () => {};

  return (
    <FinalForm
      onSubmit={onSubmitForm}
      initialValues={INITIAL_VALUES}
      render={({ handleSubmit, values, errors, submitting }) => {
        return (
          <Grid container rowSpacing={5}>
            <Items property={<FacebookRoundedIcon />}>
              <TextField
                name="facebook"
                fullWidth
                id="full-width"
                label="Facebook.com/"
                variant="outlined"
              />
            </Items>
            <Items property={<LinkedInIcon />}>
              <TextField
                name="linkedIn"
                fullWidth
                id="full-width"
                label="LinkedIn.com/"
                variant="outlined"
              />
            </Items>
            <Items property={<InstagramIcon />}>
              <TextField
                name="instragram"
                fullWidth
                id="full-width"
                label="Instagram.com/"
                variant="outlined"
              />
            </Items>

            <Items property={<TwitterIcon />}>
              <TextField
                name="twitter"
                fullWidth
                id="full-width"
                label="Twitter.com/"
                variant="outlined"
                required
              />
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

export default SocilalForm;

const Items: FC<SItemProps> = ({ property, children }) => {
  return (
    <>
      <Grid item xs={3}>
        <Box ml={5}>{property}</Box>
      </Grid>
      <Grid item xs={8}>
        {children}
      </Grid>
    </>
  );
};

"use client";
import { FC } from "react";

import { Form as FinalForm } from "react-final-form";

import { Button, Grid } from "@mui/material";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

import { TextField } from "src/components/Input";

import { SocilalFormProps } from "./Types";

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
            <Grid item xs={2}>
              <FacebookRoundedIcon sx={{ width: 40, height: 40 }} />
            </Grid>
            <Grid item xs={9}>
              <TextField
                name="facebook"
                fullWidth
                id="full-width"
                label="Facebook.com/"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={2}>
              <LinkedInIcon sx={{ width: 40, height: 40 }} />
            </Grid>
            <Grid item xs={9}>
              <TextField
                name="linkedIn"
                fullWidth
                id="full-width"
                label="LinkedIn.com/"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={2}>
              <InstagramIcon sx={{ width: 40, height: 40 }} />
            </Grid>
            <Grid item xs={9}>
              <TextField
                name="instragram"
                fullWidth
                id="full-width"
                label="Instagram.com/"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={2}>
              <TwitterIcon sx={{ width: 40, height: 40 }} />
            </Grid>
            <Grid item xs={9} container rowSpacing={2}>
              <TextField
                name="twitter"
                fullWidth
                id="full-width"
                label="Twitter.com/"
                variant="outlined"
                required
              />
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

export default SocilalForm;

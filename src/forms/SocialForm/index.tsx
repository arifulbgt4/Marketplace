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
          <form onSubmit={handleSubmit}>
            <Grid
              container
              rowSpacing={2}
              justifyContent={{ xs: "space-between", md: "flex-start" }}
            >
              <Grid item xs={5} md={3} display="flex" alignItems="center">
                <FacebookRoundedIcon sx={{ width: 30, height: 30 }} />
              </Grid>
              <Grid item xs={7}>
                <TextField
                  name="facebook"
                  fullWidth
                  size="small"
                  id="full-width"
                  label="Facebook.com/"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={5} md={3} display="flex" alignItems="center">
                <LinkedInIcon sx={{ width: 30, height: 30 }} />
              </Grid>
              <Grid item xs={7}>
                <TextField
                  name="linkedIn"
                  fullWidth
                  size="small"
                  id="full-width"
                  label="LinkedIn.com/"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={5} md={3} display="flex" alignItems="center">
                <InstagramIcon sx={{ width: 30, height: 30 }} />
              </Grid>
              <Grid item xs={7}>
                <TextField
                  name="instragram"
                  fullWidth
                  size="small"
                  id="full-width"
                  label="Instagram.com/"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={5} md={3} display="flex" alignItems="center">
                <TwitterIcon sx={{ width: 30, height: 30 }} />
              </Grid>
              <Grid item xs={7}>
                <TextField
                  name="twitter"
                  fullWidth
                  size="small"
                  id="full-width"
                  label="Twitter.com/"
                  variant="outlined"
                  required
                />
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid item xs={7} md={9} pt={2}>
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

export default SocilalForm;

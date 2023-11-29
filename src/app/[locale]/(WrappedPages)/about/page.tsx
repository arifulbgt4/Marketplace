"use client";
import { Box, Container, Grid } from "@mui/material";

import CompanyDetails from "src/widgets/CompanyDetails";
import BreadcumbBanner from "src/widgets/BreadcumbBanner";
import AboutHelpInfo from "src/widgets/AboutHelpInfo";

const About = () => {
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <BreadcumbBanner title="About us" />
        </Grid>

        <Grid item xs={12} position="relative">
          <CompanyDetails />
          {/* <AboutHelpInfo /> */}
        </Grid>
      </Grid>
    </>
  );
};

export default About;

"use client";
import { Grid } from "@mui/material";

import CompanyDetails from "src/widgets/CompanyDetails";
import BreadcumbBanner from "src/widgets/BreadcumbBanner";

const About = () => {
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <BreadcumbBanner title="About us" />
        </Grid>
        <Grid item xs={12} position="relative">
          <CompanyDetails />
        </Grid>
      </Grid>
    </>
  );
};

export default About;

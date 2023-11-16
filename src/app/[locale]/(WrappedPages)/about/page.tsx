"use client";
import { Box, Container, Grid } from "@mui/material";

import AboutContents from "src/widgets/AboutDetails";
import BreadcumbBanner from "src/widgets/BreadcumbBanner";
import AboutHelpInfo from "src/widgets/AboutHelpInfo";

const About = () => {
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <BreadcumbBanner title="About us" />
        </Grid>
      </Grid>
      <Box pt={{ xs: 3, md: 5 }}>
        <Container maxWidth="lg">
          <Grid container columnSpacing={8} rowSpacing={5}>
            <Grid item xs={12} lg={8}>
              <AboutContents />
            </Grid>
            <Grid item xs={12} lg={4}>
              <AboutHelpInfo />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default About;

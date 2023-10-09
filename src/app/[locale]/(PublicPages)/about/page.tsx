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
      <Box sx={{ py: 10 }}>
        <Container>
          <Grid container columnSpacing={10}>
            <Grid item xs={8}>
              <AboutContents />
            </Grid>
            <Grid item xs={4}>
              <AboutHelpInfo />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default About;

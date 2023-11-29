import { Box, Grid } from "@mui/material";

import AboutDetails from "src/widgets/AboutDetails";
import QuickFacts from "src/widgets/QuickFacts";

const About = () => {
  return (
    <>
      <Box pt={5}>
        <Grid container rowSpacing={5}>
          <Grid item xs={12}>
            <AboutDetails />
          </Grid>
          <Grid item xs={12}>
            company details
          </Grid>
          <Grid item xs={12}>
            <QuickFacts />
          </Grid>

          <Grid item xs={12}>
            Question
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default About;

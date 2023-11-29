import { Box, Grid } from "@mui/material";

import AboutDetails from "src/widgets/AboutDetails";
import Question from "src/widgets/Guestion";
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
            <QuickFacts
              quickFact={{
                experience: 12,
                services: 18,
                skilled: 16,
                clients: 96,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Question />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default About;

import { Box, Container, Grid } from "@mui/material";

import AboutDetails from "src/widgets/AboutDetails";

const About = () => {
  return (
    <>
      <Box pt={5}>
        <Container>
          <Grid container>
            <Grid item xs={12}>
              <AboutDetails />
            </Grid>
            <Grid item xs={12}>
              about content
            </Grid>
            <Grid item xs={12}>
              company details
            </Grid>
            <Grid item xs={12}>
              QuickFactstitle
            </Grid>
            <Grid item xs={7}>
              QuickFacts
            </Grid>
            <Grid item xs={12}>
              Question
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default About;

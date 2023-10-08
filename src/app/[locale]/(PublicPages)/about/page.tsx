import { Box, Container, Grid } from "@mui/material";

import AboutDetails from "src/widgets/AboutDetails";
import BreadcumbBanner from "src/widgets/BreadcumbBanner";
import Question from "src/widgets/Question";

const About = () => {
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <BreadcumbBanner title="About us" />
        </Grid>
      </Grid>
      <Box mt={4}>
        <Container>
          <Grid container>
            <Grid item xs={8}>
              <AboutDetails />
            </Grid>
            <Grid item xs={4}>
              <Question />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default About;

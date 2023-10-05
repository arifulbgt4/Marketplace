import { Grid } from "@mui/material";

import AboutDetails from "src/widgets/AboutDetails";
import BreadcumbBanner from "src/widgets/BreadcumbBanner/inedx";
import Question from "src/widgets/Question";

const About = () => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <BreadcumbBanner />
      </Grid>
      <Grid item xs={12} container>
        <Grid item xs={8}>
          <AboutDetails />
        </Grid>
        <Grid item xs={4}>
          <Question />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default About;

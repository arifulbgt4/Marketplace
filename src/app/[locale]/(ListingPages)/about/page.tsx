import { Grid, Paper, Typography } from "@mui/material";

import AboutDetails from "src/widgets/AboutDetails";

const About = () => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Paper>
          <Typography variant="h3">About Us</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} container>
        <Grid item xs={8}>
          <AboutDetails />
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h4">Do you have any questions?</Typography>
          <Paper>Qusestion</Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default About;

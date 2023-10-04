import { Grid, Typography, Paper } from "@mui/material";

import ContactForm from "src/forms/ContactForm";

const Conatact = () => {
  return (
    <Grid container>
      <Grid item xs={8}>
        <ContactForm />
      </Grid>
      <Grid item xs={4}>
        <Typography variant="h4">Frequently Asked Questions</Typography>
        <Paper>questions</Paper>
      </Grid>
    </Grid>
  );
};

export default Conatact;

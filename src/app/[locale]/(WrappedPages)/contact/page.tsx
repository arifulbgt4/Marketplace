import { Box, Container, Grid } from "@mui/material";

import BreadcumbBanner from "src/widgets/BreadcumbBanner";
import ContactFormContainer from "src/widgets/Contact";
import ConatactHelpInfo from "src/widgets/ConatactHelpInfo";

const Conatact = () => {
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <BreadcumbBanner title="Contact us" />
        </Grid>
      </Grid>
      <Box pt={{ xs: 3, md: 5 }}>
        <Container maxWidth="lg">
          <Grid container columnSpacing={8} rowSpacing={5}>
            <Grid item xs={12} md={8}>
              <ContactFormContainer />
            </Grid>
            <Grid item xs={12} md={4}>
              <ConatactHelpInfo />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Conatact;

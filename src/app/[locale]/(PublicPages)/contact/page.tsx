import { Box, Container, Grid } from "@mui/material";

import BreadcumbBanner from "src/widgets/BreadcumbBanner";
import ContactF from "src/widgets/Contact";
import Question from "src/widgets/Question";

const Conatact = () => {
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <BreadcumbBanner title="Contact us" />
        </Grid>
      </Grid>
      <Box>
        <Container>
          <Grid container>
            <Grid item xs={8}>
              <ContactF />
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

export default Conatact;

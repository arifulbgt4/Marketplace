import { Box, Container, Grid, Paper, Stack, Typography } from "@mui/material";

import ContactHelpInfo from "src/components/ContactHelpInfo";
import ContactForm from "src/forms/ContactForm";
import ContactInfo from "src/widgets/ContactInfo";

const Conatact = () => {
  return (
    <Box pt={5}>
      <Container maxWidth="lg">
        <Stack flexDirection="row">
          <Paper sx={{ p: 5, borderRadius: 5 }}>
            <Grid container columnSpacing={10}>
              <Grid item xs={6}>
                <Stack gap={1} pb={3}>
                  <Typography color="primary.main" variant="h4">
                    GET IN TOUCH
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Lorem ipsum dolor sit amet consectetur. Purus viverra eget
                    integer sit dictum.
                  </Typography>
                </Stack>
                <ContactForm />
              </Grid>
              <Grid item xs={6}>
                <Stack justifyContent="space-between" height="100%">
                  <Box>
                    <Typography variant="h3"> Map</Typography>
                  </Box>
                  <ContactInfo />
                </Stack>
              </Grid>
            </Grid>
          </Paper>
          <ContactHelpInfo />
        </Stack>
      </Container>
    </Box>
  );
};

export default Conatact;

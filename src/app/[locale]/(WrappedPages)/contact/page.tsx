"use client";
import { Box, Container, Grid, Typography } from "@mui/material";

import ContactForm from "src/forms/ContactForm";
import ContactInfo from "src/widgets/ContactInfo";

const Conatact = () => {
  return (
    <Box pt={10}>
      <Container maxWidth="lg">
        <Grid container spacing={10}>
          <Grid item xs={12}>
            <Container maxWidth="md">
              <Typography
                sx={(theme) => ({
                  backgroundcolor: "primary",
                  backgroundImage: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main},${theme.palette.primary.main})`,
                  backgroundSize: "100%",
                  backgroundRepeat: "repeat",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                })}
                variant="h1"
                textAlign="center"
              >
                We love meeting new people and helping them.
              </Typography>
            </Container>
          </Grid>
          <Grid item container xs={12} spacing={15}>
            <Grid item xs={4}>
              <ContactInfo />
            </Grid>
            <Grid item xs={8}>
              <ContactForm />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Conatact;

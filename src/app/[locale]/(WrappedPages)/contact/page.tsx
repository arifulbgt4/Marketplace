"use client";
import { Box, Container, Grid, Typography } from "@mui/material";

import ContactForm from "src/forms/ContactForm";

const Conatact = () => {
  return (
    <Box pt={10}>
      <Container maxWidth="md">
        <Grid container spacing={10}>
          <Grid item xs={12}>
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
          </Grid>
          <Grid item xs={12}>
            <ContactForm />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Conatact;

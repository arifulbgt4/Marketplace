import { FC } from "react";
import { Stack, Typography, Container, Divider, Grid } from "@mui/material";

import { QuickFactsProps } from "./Types";

const QuickFacts: FC<QuickFactsProps> = ({ quickFact }) => {
  const { experience, services, skilled, clients } = quickFact;
  return (
    <Stack gap={5}>
      <Stack justifyContent="center" alignItems="center">
        <Typography variant="h6" color="secondary.main">
          OVERVIEW ON OUR CAREER
        </Typography>
        <Typography variant="h2">FIND QUICK FACTS</Typography>
      </Stack>
      <Divider />
      <Container>
        <Grid container justifyContent="center">
          <Grid container item xs={12} md={9} spacing={5}>
            <Grid item xs={12} sm={6} md={3}>
              <Stack justifyContent="center" alignItems="center">
                <Typography variant="h2">{experience}</Typography>
                <Typography variant="h3">Years of Experience</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Stack justifyContent="center" alignItems="center">
                <Typography variant="h2">{services}</Typography>
                <Typography variant="h3">Different Services</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Stack justifyContent="center" alignItems="center">
                <Typography variant="h2">
                  {clients}
                  {"%"}
                </Typography>
                <Typography variant="h3">Satisfied Clients</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Stack justifyContent="center" alignItems="center">
                <Typography variant="h2">{skilled}</Typography>
                <Typography variant="h3">Skilled Agents</Typography>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Divider />
    </Stack>
  );
};

export default QuickFacts;

import { FC } from "react";
import { Stack, Typography, Container, Divider } from "@mui/material";

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
        <Stack flexDirection="row" justifyContent="space-around" gap={5}>
          <Stack justifyContent="center" alignItems="center">
            <Typography variant="h2">{experience}</Typography>
            <Typography variant="h3">Years of Experience</Typography>
          </Stack>
          <Stack justifyContent="center" alignItems="center">
            <Typography variant="h2">{services}</Typography>
            <Typography variant="h3">Different Services</Typography>
          </Stack>
          <Stack justifyContent="center" alignItems="center">
            <Typography variant="h2">
              {clients}
              {"%"}
            </Typography>
            <Typography variant="h3">Satisfied Clients</Typography>
          </Stack>
          <Stack justifyContent="center" alignItems="center">
            <Typography variant="h2">{skilled}</Typography>
            <Typography variant="h3">Skilled Agents</Typography>
          </Stack>
        </Stack>
      </Container>
      <Divider />
    </Stack>
  );
};

export default QuickFacts;

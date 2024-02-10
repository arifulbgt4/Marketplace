"use client";
import { FC } from "react";
import { Stack, Box, Typography, Container, Link } from "@mui/material";

import routes from "src/global/routes";

import { QuestionProps } from "./Types";

const Question: FC<QuestionProps> = () => {
  return (
    <Container>
      <Stack
        flexDirection={{ md: "row" }}
        gap={{ md: 5, xs: 2 }}
        justifyContent="center"
      >
        <Box
          component={Link}
          href={routes.faq}
          px={{ md: 15 }}
          py={{ md: 12, xs: 2 }}
          bgcolor="info.light"
          color="info.contrastText"
          textAlign="center"
          fontWeight={100}
          sx={(theme) => ({
            transition: ".5s",
            "&:hover": {
              bgcolor: "info.main",
              transform: "scale(1.02)",
              borderRadius: 1,
              boxShadow: theme.shadows[1],
            },
          })}
        >
          <Typography sx={{ typography: { md: "h2", xs: "h3" } }}>
            HAVE A QUESTION?
          </Typography>
        </Box>

        <Box
          component={Link}
          href={routes.listings}
          px={{ md: 15 }}
          py={{ md: 12, xs: 2 }}
          bgcolor="secondary.main"
          textAlign="center"
          sx={{
            transition: ".5s",
            "&:hover": {
              bgcolor: "secondary.dark",
              transform: "scale(1.02)",
              borderRadius: 1,
              boxShadow: 1,
            },
          }}
          color="secondary.contrastText"
        >
          <Typography
            fontWeight={100}
            sx={{ typography: { md: "h2", xs: "h3" } }}
            color="common.white"
          >
            FIND AN AGENT
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
};

export default Question;

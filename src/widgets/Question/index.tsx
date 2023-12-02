"use client";
import { FC } from "react";
import { Stack, Box, Typography, Container } from "@mui/material";

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
          px={{ md: 15 }}
          py={{ md: 5, xs: 3 }}
          bgcolor={(theme) => theme.palette.primary.main}
          textAlign="center"
        >
          <Typography variant="h2">HAVE A QUESTION?</Typography>
        </Box>
        <Box
          px={{ md: 15 }}
          py={{ md: 5, xs: 3 }}
          bgcolor="common.black"
          textAlign="center"
        >
          <Typography variant="h2" color="common.white">
            HAVE A QUESTION?
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
};

export default Question;

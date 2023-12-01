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
          px={{ md: 15, xs: 5 }}
          py={{ md: 15, xs: 5 }}
          bgcolor={(theme) => theme.palette.primary.main}
        >
          <Typography
            variant="h2"
            color={(theme) => theme.palette.background.default}
          >
            HAVE A QUESTION?
          </Typography>
        </Box>
        <Box
          px={{ md: 15, xs: 5 }}
          py={{ md: 15, xs: 5 }}
          bgcolor="common.black"
        >
          <Typography
            variant="h2"
            color={(theme) => theme.palette.background.default}
          >
            HAVE A QUESTION?
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
};

export default Question;

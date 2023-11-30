"use client";
import { FC } from "react";
import { Stack, Box, Typography, Container } from "@mui/material";

import { QuestionProps } from "./Types";

const Question: FC<QuestionProps> = () => {
  return (
    <Container>
      <Stack flexDirection="row" gap={5} justifyContent="center">
        <Box px={15} py={5} bgcolor={(theme) => theme.palette.primary.main}>
          <Typography variant="h2">HAVE A QUESTION?</Typography>
        </Box>
        <Box px={15} py={5} bgcolor="common.black">
          <Typography variant="h2" color="common.white">
            HAVE A QUESTION?
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
};

export default Question;

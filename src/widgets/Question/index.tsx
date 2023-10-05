import { FC } from "react";
import { Box, Paper, Typography } from "@mui/material";

import { QuestionProps } from "./Types";

const Question: FC<QuestionProps> = () => {
  return (
    <Box>
      <Typography variant="h4">Do you have any questions?</Typography>
      <Paper>Qustions</Paper>
    </Box>
  );
};

export default Question;

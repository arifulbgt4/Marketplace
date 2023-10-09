import { FC } from "react";
import { Typography, Box, Paper } from "@mui/material";

import { InfoProps } from "./Types";

const Info: FC<InfoProps> = ({ title, children }) => {
  return (
    <Paper elevation={11}>
      <Box py={3} pl={7} bgcolor="inherit">
        <Typography variant="h4">{title}</Typography>
      </Box>
      <Box>{children}</Box>
    </Paper>
  );
};

export default Info;

"use client";
import { FC } from "react";
import { Typography, Box, Paper } from "@mui/material";

import { InfoProps } from "./Types";

const Info: FC<InfoProps> = ({ title, children }) => {
  return (
    <Box>
      {title && (
        <Box
          py={3}
          px={5}
          sx={(theme) => ({
            bgcolor: theme.palette.info.dark,
            color: theme.palette.info.contrastText,
          })}
        >
          <Typography variant="h4">{title}</Typography>
        </Box>
      )}
      <Paper sx={{ p: 5 }} elevation={0}>
        {children}
      </Paper>
    </Box>
  );
};

export default Info;

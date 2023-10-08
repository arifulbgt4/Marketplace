import { FC } from "react";
import { Stack, Typography, Box } from "@mui/material";

import { InfoProps } from "./Types";

const Info: FC<InfoProps> = ({ title, children }) => {
  return (
    <Stack>
      <Typography>{title}</Typography>
      <Box>{children}</Box>
    </Stack>
  );
};

export default Info;

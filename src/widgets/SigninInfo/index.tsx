import { FC } from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";

import Info from "src/components/Info";

import { SigninInfoProps } from "./Types";

const SigninInfo: FC<SigninInfoProps> = () => {
  return (
    <Stack>
      <Paper>
        <Info title="Registration benifits">
          <Typography>recent properties</Typography>
        </Info>
      </Paper>
    </Stack>
  );
};

export default SigninInfo;

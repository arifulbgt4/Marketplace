import { FC } from "react";
import { Paper, Stack, MenuItem } from "@mui/material";

import Info from "src/components/Info";

import { SignupInfoProps } from "./Types";

const SignupInfo: FC<SignupInfoProps> = () => {
  return (
    <Stack>
      <Paper>
        <Info title="Why Sign Up?">
          <MenuItem>recent properties</MenuItem>
        </Info>
      </Paper>
    </Stack>
  );
};

export default SignupInfo;

import { FC } from "react";
import { Stack, Typography, Paper } from "@mui/material";

import { UserDetailsProps } from "./Types";

const UserDetails: FC<UserDetailsProps> = () => {
  return (
    <Paper>
      <Stack>
        <Stack direction="row">
          <Typography>First Name</Typography>
          <Typography>:abcd</Typography>
        </Stack>
        <Stack direction="row">
          <Typography>Last name</Typography>
          <Typography>:efgh</Typography>
        </Stack>
        <Stack direction="row">
          <Typography>Adress</Typography>
          <Typography>adress</Typography>
        </Stack>
        <Stack direction="row">
          <Typography>Email Adress</Typography>
          <Typography>:@mail</Typography>
        </Stack>
        <Stack direction="row">
          <Typography>Phone Number</Typography>
          <Typography>:012433</Typography>
        </Stack>
        <Stack direction="row">
          <Typography>Phone Number</Typography>
          <Typography>:012433</Typography>
        </Stack>
        <Stack direction="row">
          <Typography>Age</Typography>
          <Typography>:33</Typography>
        </Stack>
        <Stack direction="row">
          <Typography>Gender</Typography>
          <Typography>:male</Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default UserDetails;

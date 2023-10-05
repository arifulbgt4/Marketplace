import { FC } from "react";
import { Paper } from "@mui/material";

import UserMediaForm from "../UserMediaForm";

import { UserMediaProps } from "./Types";

const UserMedia: FC<UserMediaProps> = () => {
  return (
    <Paper>
      <UserMediaForm />
    </Paper>
  );
};

export default UserMedia;

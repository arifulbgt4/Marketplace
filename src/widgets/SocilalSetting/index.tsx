import { FC } from "react";
import { Paper } from "@mui/material";

import SocilalForm from "src/forms/SocialForm";

import { SocilalFormChangeProps } from "./Types";

const SocilalSettings: FC<SocilalFormChangeProps> = () => {
  return (
    <Paper>
      <SocilalForm />
    </Paper>
  );
};

export default SocilalSettings;
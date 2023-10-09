import { Grid } from "@mui/material";

import UserSettingForm from "src/forms/UserSettingForm";

const Settings = () => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <UserSettingForm />
      </Grid>
    </Grid>
  );
};

export default Settings;

import { Grid } from "@mui/material";

import UserSettingForm from "src/forms/UserSettingForm";
import UserSettingItem from "src/widgets/UserSettingItem";

const Settings = () => {
  return (
    <Grid container>
      <Grid item xs={8}>
        <UserSettingForm />
      </Grid>
      <Grid item xs={4}>
        <UserSettingItem />
      </Grid>
    </Grid>
  );
};

export default Settings;

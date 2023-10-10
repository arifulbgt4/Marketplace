import { Grid } from "@mui/material";

import ChangePasswordForm from "src/forms/ChangePasswordForm";

const ChangePassword = () => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <ChangePasswordForm />
      </Grid>
    </Grid>
  );
};

export default ChangePassword;

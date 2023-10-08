import { Grid, MenuItem, Typography } from "@mui/material";
import Info from "src/components/Info";
import SigninForm from "src/forms/SigninForm";
import SigninInfo from "src/widgets/SigninInfo";

export default function SignIn() {
  return (
    <Grid container>
      <Grid item sm={12} md={8}>
        <SigninForm />
      </Grid>
      <Grid item sm={12} md={4}>
        <SigninInfo />
      </Grid>
    </Grid>
  );
}

import { Grid, MenuItem } from "@mui/material";
import Info from "src/components/Info";
import SignupForm from "src/forms/SignupForm";

export default function SignUp() {
  return (
    <Grid container>
      <Grid item sm={12} md={8}>
        <SignupForm />
      </Grid>
      <Grid item sm={12} md={4}>
        <Info title="Why Sign Up?">
          <MenuItem>recent properties</MenuItem>
        </Info>
      </Grid>
    </Grid>
  );
}

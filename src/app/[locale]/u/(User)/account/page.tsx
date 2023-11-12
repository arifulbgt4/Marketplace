import { Grid } from "@mui/material";

import AccountHelpInfo from "src/widgets/ProfileHelpInfo";
import AccountDetails from "src/widgets/AccountDetails";

export default function Account() {
  return (
    <Grid container columnSpacing={10}>
      <Grid item xs={8}>
        <AccountDetails />
      </Grid>
      <Grid item xs={4}>
        <AccountHelpInfo />
      </Grid>
    </Grid>
  );
}

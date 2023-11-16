import { Grid } from "@mui/material";

import AccountHelpInfo from "src/widgets/ProfileHelpInfo";
import AccountDetails from "src/widgets/AccountDetails";

export default function Account() {
  return (
    <Grid container columnSpacing={10} rowSpacing={3}>
      <Grid item md={8} xs={12}>
        <AccountDetails />
      </Grid>
      <Grid item md={4} xs={12}>
        <AccountHelpInfo />
      </Grid>
    </Grid>
  );
}

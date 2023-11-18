import { Grid } from "@mui/material";

import AccountDetails from "src/widgets/AccountDetails";

export default function Account() {
  return (
    <Grid container columnSpacing={10} rowSpacing={3}>
      <Grid item md={8} xs={12}>
        <AccountDetails />
      </Grid>
    </Grid>
  );
}

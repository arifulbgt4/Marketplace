import { Grid } from "@mui/material";

import VisitorStatistic from "src/widgets/VisitorStatistic";

const DashboardPage = () => {
  return (
    <Grid container rowSpacing={5} columnSpacing={8}>
      <Grid item xs={4}>
        <VisitorStatistic />
      </Grid>
    </Grid>
  );
};

export default DashboardPage;

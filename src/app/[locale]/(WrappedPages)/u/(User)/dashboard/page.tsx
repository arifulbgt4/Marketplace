import { Grid } from "@mui/material";

import SellStatistics from "src/widgets/SellStatistics";
import VisitorStatistic from "src/widgets/VisitorStatistic";

const DashboardPage = () => {
  return (
    <Grid container rowSpacing={5} columnSpacing={8}>
      <Grid item xs={4}>
        <VisitorStatistic />
      </Grid>
      <Grid item xs={12}>
        <SellStatistics />
      </Grid>
    </Grid>
  );
};

export default DashboardPage;

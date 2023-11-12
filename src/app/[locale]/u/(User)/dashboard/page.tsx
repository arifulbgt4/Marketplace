import { Box, Container, Grid } from "@mui/material";

import DashboardHelpInfo from "src/widgets/DashboardHelpInfo";
import StatisticsGroup from "src/widgets/StatisticsGroup";
import UserMap from "src/widgets/UserMap";

const DashboardPage = () => {
  return (
    <Grid container columnSpacing={10}>
      <Grid item xs={8}>
        <StatisticsGroup />
        <UserMap />
      </Grid>
      <Grid item xs={4}>
        <DashboardHelpInfo />
      </Grid>
    </Grid>
  );
};

export default DashboardPage;

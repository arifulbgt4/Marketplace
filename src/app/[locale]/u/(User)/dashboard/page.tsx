import { Box, Container, Grid, Stack } from "@mui/material";

import DashboardHelpInfo from "src/widgets/DashboardHelpInfo";
import StatisticsGroup from "src/widgets/StatisticsGroup";
import UserMap from "src/widgets/UserMap";

const DashboardPage = () => {
  return (
    <Grid container rowSpacing={5} columnSpacing={8}>
      <Grid item xs={12} md={8}>
        <Stack gap={6}>
          <StatisticsGroup />
          <UserMap />
        </Stack>
      </Grid>
      <Grid item xs={12} md={4}>
        <DashboardHelpInfo />
      </Grid>
    </Grid>
  );
};

export default DashboardPage;

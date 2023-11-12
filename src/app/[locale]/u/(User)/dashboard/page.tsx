import { Box, Container, Grid, Stack } from "@mui/material";

import DashboardHelpInfo from "src/widgets/DashboardHelpInfo";
import StatisticsGroup from "src/widgets/StatisticsGroup";
import UserMap from "src/widgets/UserMap";

const DashboardPage = () => {
  return (
    <Box>
      <Container>
        <Grid container rowSpacing={5} columnSpacing={10}>
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
      </Container>
    </Box>
  );
};

export default DashboardPage;

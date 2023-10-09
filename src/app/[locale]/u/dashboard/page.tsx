import { Box, Container, Grid, Typography } from "@mui/material";
import Info from "src/components/Info";
import BannerCreateListing from "src/widgets/BannerCreateListing";
import StatisticsGroup from "src/widgets/StatisticsGroup";

import UserMap from "src/widgets/UserMap";

const DashboardPage = () => {
  return (
    <Box>
      <Container>
        <Grid container columnSpacing={10}>
          <Grid item xs={8}>
            <StatisticsGroup />
            <UserMap />
          </Grid>
          <Grid item xs={4}>
            <Info title="Begin Upload">
              <BannerCreateListing />
            </Info>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DashboardPage;

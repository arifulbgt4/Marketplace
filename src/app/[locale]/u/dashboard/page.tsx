import { Box, Container, Grid, Typography } from "@mui/material";
import BannerCreateListing from "src/widgets/BannerCreateListing";
import StatisticsGroup from "src/widgets/StatisticsGroup";

import UserMap from "src/widgets/UserMap";

const DashboardPage = () => {
  return (
    <Box>
      <Container>
        <Grid container>
          <Grid item xs={8}>
            <StatisticsGroup />
            <UserMap />
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h4">Begin Upload</Typography>
            <BannerCreateListing />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DashboardPage;

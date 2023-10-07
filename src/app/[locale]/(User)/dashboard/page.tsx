import { Box, Container, Grid, Typography } from "@mui/material";
import BannerCreateListing from "src/widgets/BannerCreateListing";

import StatisticsCardGroup from "src/widgets/StatisticsCardGruop";
import UserMap from "src/widgets/UserMap";

const Dashboard = () => {
  return (
    <Box>
      <Container>
        <Grid container>
          <Grid item xs={8}>
            <StatisticsCardGroup />
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

export default Dashboard;

import { Grid } from "@mui/material";

import VisitorStatistic from "src/widgets/VisitorStatistic";

const uData = [
  0, 900, 700, 1580, 1190, 1790, 700, 2750, 700, 2900, 700, 1890, 3290, 2990,
];

const visitorData = {
  xLabels: [
    "Page A",
    "Page B",
    "Page C",
    "Page D",
    "Page E",
    "Page F",
    "Page G",
    "Page H",
    "Page I",
    "Page J",
    "Page K",
    "Page L",
    "Page M",
    "Page N",
  ],
  uData: [
    0, 900, 700, 1580, 1190, 1790, 700, 2750, 700, 2900, 700, 1890, 3290, 2990,
  ],
  visitors: 345678,
};

const DashboardPage = () => {
  return (
    <Grid container rowSpacing={5} columnSpacing={8}>
      <Grid item xs={4}>
        <VisitorStatistic visitorData={visitorData} />
      </Grid>
    </Grid>
  );
};

export default DashboardPage;

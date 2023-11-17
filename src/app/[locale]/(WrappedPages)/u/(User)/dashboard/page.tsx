import { Grid } from "@mui/material";

import SellStatistics from "src/widgets/SellStatistics";
import VisitorStatistic from "src/widgets/VisitorStatistic";

const sellData = {
  yrData: [
    4000, 3000, 2000, 2780, 1890, 2390, 3490, 4000, 3000, 2000, 2780, 1890,
  ],
  yrLebel: [
    "Dec",
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "Jun",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
  ],
  weekLebel: ["Sat", "Sun", "Mun", "Tue", "Wed", "Thu", "Fri"],
  weekData: [121, 454, 231, 56, 675, 234, 543],
  monthData: [
    121, 454, 231, 56, 675, 234, 543, 121, 454, 231, 56, 675, 234, 543, 121,
    454, 231, 56, 675, 234, 543, 121, 454, 231, 56, 675, 234, 543, 454, 831,
  ],
  monthLabel: [
    "Nov/18",
    "Nov/19",
    "Nov/20",
    "Nov/21",
    "Nov/22",
    "Nov/23",
    "Nov/24",
    "Nov/25",
    "Nov/26",
    "Nov/27",
    "Nov/28",
    "Nov/29",
    "Nov/30",
    "Dec/1",
    "Dec/2",
    "Dec/3",
    "Dec/4",
    "Dec/5",
    "Dec/6",
    "Dec/7",
    "Dec/8",
    "Dec/9",
    "Dec/10",
    "Dec/11",
    "Dec/12",
    "Dec/13",
    "Dec/14",
    "Dec/15",
    "Dec/16",
    "Nov/17",
  ],
  grow: 12,
  newSell: 48,
  totalSell: 345678,
};

const DashboardPage = () => {
  return (
    <Grid container rowSpacing={5} columnSpacing={8}>
      <Grid item container xs={12}>
        <Grid item xs={4}>
          <VisitorStatistic />
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <SellStatistics sellData={sellData} />
      </Grid>
    </Grid>
  );
};

export default DashboardPage;

import { Grid } from "@mui/material";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";

import DashBoardWidget from "src/widgets/DashBoardWidget";
import SellStatistics from "src/widgets/SellStatistics";
import VisitorStatistic from "src/widgets/VisitorStatistic";
import UserStatistic from "src/widgets/UserStatistic";

const weekSellData = {
  weekLebel: ["Sat", "Sun", "Mun", "Tue", "Wed", "Thu", "Fri"],
  weekData: [121, 454, 231, 56, 675, 234, 543],
  weekGrow: -12,
  weekNewSell: 25,
  weekTotalSell: 5678,
};

const monthSellData = {
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
  monthGrow: 23,
  monthNewSell: 48,
  monthTotalSell: 45678,
};

const yearSellData = {
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
  YrGrow: 30,
  YrNewSell: 343,
  YrTotalSell: 1456781,
};

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
const genderValue = {
  male: 50,
  female: 35,
  other: 15,
};

const DashboardPage = () => {
  return (
    <Grid container rowSpacing={5} columnSpacing={8}>
      <Grid item container xs={8} columnSpacing={7} rowSpacing={4}>
        <Grid item xs={6}>
          <DashBoardWidget
            icon={BusinessCenterIcon}
            totalItem="Total Product"
            totalValue={932}
          />
        </Grid>
        <Grid item xs={6}>
          <DashBoardWidget
            icon={InsertDriveFileIcon}
            totalItem="Total Order"
            totalValue={654}
          />
        </Grid>
        <Grid item xs={6}>
          <DashBoardWidget
            icon={MonetizationOnIcon}
            totalItem="Total Sell"
            totalValue={854}
          />
        </Grid>
        <Grid item xs={6}>
          <DashBoardWidget
            icon={CurrencyBitcoinIcon}
            totalItem="Total Customer"
            totalValue={754}
          />
        </Grid>
      </Grid>
      <Grid item xs={4}>
        <VisitorStatistic visitorData={visitorData} />
      </Grid>
      <Grid item xs={12}>
        <SellStatistics
          weekSellData={weekSellData}
          monthSellData={monthSellData}
          yearSellData={yearSellData}
        />
      </Grid>
      <Grid item container xs={12} columnSpacing={4}>
        <Grid item xs={3}>
          <UserStatistic genderValue={genderValue} />
        </Grid>
        <Grid item xs={9}>
          Sell Statistic
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DashboardPage;

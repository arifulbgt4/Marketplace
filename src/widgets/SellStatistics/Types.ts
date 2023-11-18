export interface SellStatisticsProps {
  weekSellData: {
    weekData: number[];
    weekLebel: string[];
    weekGrow: number;
    weekNewSell: number;
    weekTotalSell: number;
  };
  monthSellData: {
    monthData: number[];
    monthLabel: string[];
    monthGrow: number;
    monthNewSell: number;
    monthTotalSell: number;
  };
  yearSellData: {
    yrData: number[];
    yrLebel: string[];
    YrGrow: number;
    YrNewSell: number;
    YrTotalSell: number;
  };
}

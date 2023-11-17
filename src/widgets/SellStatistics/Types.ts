export interface SellStatisticsProps {
  sellData: {
    monthData: number[];
    monthLabel: string[];
    yrData: number[];
    yrLebel: string[];
    weekData: number[];
    weekLebel: string[];
    grow: number;
    newSell: number;
    totalSell: number;
  };
}

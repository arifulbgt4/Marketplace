export interface UserSellStatisticProps {
  userStatisticData: {
    uData: number[];
    pData: number[];
    xLabels: string[];
  };
  userWeeklyData: {
    data: number[];
    xAxis: string[];
    impar: number;
    yearGroth: number;
  };
}

export interface WeekChatProps {
  userWeeklyData: {
    data: number[];
    xAxis: string[];
    impar: number;
    yearGroth: number;
  };
}

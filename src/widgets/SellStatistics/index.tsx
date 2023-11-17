"use client";
import { FC } from "react";
import { BarChart, BarPlot } from "@mui/x-charts/BarChart";

const uData = [
  4000, 3000, 2000, 2780, 1890, 2390, 3490, 4000, 3000, 2000, 2780, 1890,
];

import { SellStatisticsProps } from "./Types";

const SellStatistics: FC<SellStatisticsProps> = () => {
  return (
    <BarChart
      xAxis={[
        {
          scaleType: "band",
          data: [
            "group A",
            "group B",
            "group C",
            "group D",
            "group E",
            "group F",
            "group G",
            "group H",
            "group I",
            "group J",
            "group K",
            "group L",
          ],
        },
      ]}
      series={[{ data: uData }]}
      height={300}
    />
  );
};

export default SellStatistics;

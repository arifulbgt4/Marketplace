"use client";
import { FC } from "react";
import { ChartContainer, LineChart } from "@mui/x-charts";
import { LinePlot, MarkPlot } from "@mui/x-charts/LineChart";
const uData = [
  0, 900, 700, 1580, 1190, 1790, 700, 2750, 700, 2900, 700, 1890, 3290, 2990,
];
const xLabels = [
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
];

import { VisitorStatisticProps } from "./Types";
import { Paper, Stack, Typography } from "@mui/material";

const VisitorStatistic: FC<VisitorStatisticProps> = () => {
  return (
    <Paper>
      <Stack flexDirection="row" justifyContent="space-between" p={3}>
        <Typography variant="h4">Visitor Chart</Typography>
        <Typography variant="h4">345,678</Typography>
      </Stack>

      <LineChart
        width={452}
        height={118}
        series={[{ type: "line", data: uData, area: true, showMark: false }]}
        xAxis={[{ scaleType: "point", data: xLabels }]}
        bottomAxis={{ disableLine: true }}
        leftAxis={{ disableLine: true }}
        sx={(theme) => ({
          ".MuiLineElement-root": {
            stroke: theme.palette.primary.main,
            strokeWidth: 5,
          },
          ".MuiHighlightElement-root": {
            scale: "1.5",
            stroke: theme.palette.common.white,
            fill: theme.palette.primary.main,
            strokeWidth: 2,
          },
          ".MuiAreaElement-root": {
            fill: theme.palette.secondary.main,
            opacity: 0.1,
          },
        })}
        margin={{ left: 0, right: 0, bottom: 0, top: 0 }}
      ></LineChart>
    </Paper>
  );
};

export default VisitorStatistic;

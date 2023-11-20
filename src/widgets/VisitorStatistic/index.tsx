"use client";
import { FC } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Paper, Stack, Typography } from "@mui/material";

import { VisitorStatisticProps } from "./Types";

const VisitorStatistic: FC<VisitorStatisticProps> = ({ visitorData }) => {
  const { visitors, xLabels, uData } = visitorData;
  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        borderRadius: 2.5,
        border: `2px solid ${theme.palette.primary.light}`,
      })}
    >
      <Stack flexDirection="row" justifyContent="space-between" p={3}>
        <Typography variant="h4">Visitors</Typography>
        <Typography variant="h4">{visitors}</Typography>
      </Stack>

      <LineChart
        height={168}
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

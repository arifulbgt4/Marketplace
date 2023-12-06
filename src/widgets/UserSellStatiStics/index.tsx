"use client";
import { FC } from "react";
import { Box, Grid, Paper, Stack, Typography, useTheme } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart, ChartsReferenceLine } from "@mui/x-charts";

import { UserSellStatisticProps, WeekChatProps } from "./Type";

const UserSellStatistic: FC<UserSellStatisticProps> = ({
  userStatisticData,
  userWeeklyData,
}) => {
  const { uData, pData, xLabels } = userStatisticData;

  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        p: 4,
        borderRadius: 2.5,
        border: `2px solid ${theme.palette.primary.light}`,
      })}
    >
      <Grid container columnSpacing={7.5} rowSpacing={4}>
        <Grid item xs={12} md={8}>
          <Stack gap={2}>
            <Typography variant="h5">Sell Statistic</Typography>
            <Box>
              <LineChart
                height={308}
                series={[
                  { data: uData, showMark: false },
                  { data: pData, showMark: false },
                ]}
                xAxis={[{ scaleType: "point", data: xLabels }]}
                leftAxis={{ disableLine: true }}
                bottomAxis={{ disableLine: true }}
                sx={(theme) => ({
                  ".MuiHighlightElement-root": {
                    scale: "1.5",
                    stroke: theme.palette.common.white,
                    strokeWidth: 2,
                  },
                })}
                margin={{ left: 5, right: 5, bottom: 10, top: 5 }}
              >
                <ChartsReferenceLine
                  x="0"
                  lineStyle={{ stroke: theme.palette.divider }}
                />
                <ChartsReferenceLine
                  x="2"
                  lineStyle={{ stroke: theme.palette.divider }}
                />
                <ChartsReferenceLine
                  x="4"
                  lineStyle={{ stroke: theme.palette.divider }}
                />
                <ChartsReferenceLine
                  x="6"
                  lineStyle={{ stroke: theme.palette.divider }}
                />
                <ChartsReferenceLine
                  x="8"
                  lineStyle={{ stroke: theme.palette.divider }}
                />
                <ChartsReferenceLine
                  x="10"
                  lineStyle={{ stroke: theme.palette.divider }}
                />
                <ChartsReferenceLine
                  x="12"
                  lineStyle={{ stroke: theme.palette.divider }}
                />
              </LineChart>
              <Stack flexDirection="row" justifyContent="space-between" pt={2}>
                <Typography color="text.disabled">0</Typography>
                <Typography color="text.disabled">2</Typography>
                <Typography color="text.disabled">4</Typography>
                <Typography color="text.disabled">6</Typography>
                <Typography sx={{ pl: 2 }} color="text.disabled">
                  8
                </Typography>
                <Typography color="text.disabled">10</Typography>
                <Typography color="text.disabled">12</Typography>
              </Stack>
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <WeekChat userWeeklyData={userWeeklyData} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default UserSellStatistic;

const WeekChat: FC<WeekChatProps> = ({ userWeeklyData }) => {
  const { data, xAxis, impar, yearGroth } = userWeeklyData;
  return (
    <Stack gap={4}>
      <Typography variant="h5">Weekly</Typography>
      <Stack flexDirection="row" justifyContent="space-between">
        <Stack gap={1.5}>
          <Typography variant="subtitle1" color="text.secondary">
            This week
          </Typography>
          <Typography color="success.main" variant="h5">
            + 20%
          </Typography>
        </Stack>
        <Stack gap={1.5}>
          <Typography variant="subtitle1" color="text.secondary">
            Last week
          </Typography>
          <Typography color="primary.main" variant="h5">
            + 12%
          </Typography>
        </Stack>
      </Stack>
      <Typography variant="h5">Impression</Typography>
      <Box>
        <BarChart
          xAxis={[
            {
              id: "barCategories",
              data: xAxis,
              scaleType: "band",
            },
          ]}
          series={[
            {
              data: data,
            },
          ]}
          bottomAxis={{ disableLine: true }}
          leftAxis={{ disableLine: true }}
          height={83}
          margin={{ left: 0, right: 0, bottom: 12, top: 0 }}
        />
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="subtitle1">{impar}</Typography>
          <Stack flexDirection="row" alignItems="center" gap={0.5}>
            <Typography variant="subtitle1" color="primary.main">
              {yearGroth}
              {"%"}
            </Typography>
            <Typography variant="subtitle2" color="text.disabled">
              than last year
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};

"use client";
import { FC } from "react";
import { useTheme } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { Paper, Stack, Typography, Box } from "@mui/material";

import { UserStatisticProps } from "./Types";

const UserStatistic: FC<UserStatisticProps> = ({ genderValue }) => {
  const { male, female } = genderValue;
  const theme = useTheme();
  return (
    <Stack
      component={Paper}
      elevation={0}
      p={{ xs: 2, md: 3.15 }}
      gap={{ xs: 3, md: 4.45 }}
      borderRadius={2.5}
      border={2}
      borderColor={(theme) => theme.palette.primary.light}
    >
      <Typography variant="h5">User Profile</Typography>
      <PieChart
        series={[
          {
            data: [
              { id: 0, value: male, label: "Male" },
              { id: 1, value: female, label: "Female" },
            ],

            innerRadius: 38,
          },
        ]}
        height={231}
        slotProps={{
          legend: { hidden: true },
        }}
        colors={[theme.palette.info.dark, theme.palette.warning.light]}
        margin={{ right: 5 }}
      />
      <Stack gap={2}>
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            gap={2}
          >
            <Box
              height={20}
              width={20}
              borderRadius={5}
              border={4}
              borderColor={(theme) => theme.palette.info.dark}
            />
            <Typography variant="subtitle1">Male</Typography>
          </Stack>
          <Typography variant="h6">
            {male}
            {"%"}
          </Typography>
        </Stack>
        <Stack flexDirection="row" justifyContent="space-between">
          <Stack
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            gap={2}
          >
            <Box
              height={20}
              width={20}
              borderRadius={5}
              border={4}
              borderColor={(theme) => theme.palette.warning.light}
            />
            <Typography variant="subtitle1">Female</Typography>
          </Stack>
          <Typography variant="h6">
            {female}
            {"%"}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default UserStatistic;

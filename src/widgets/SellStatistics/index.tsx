"use client";
import { FC, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Paper,
  Stack,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Hidden,
} from "@mui/material";

import { SellStatisticsProps } from "./Types";

const SellStatistics: FC<SellStatisticsProps> = ({
  weekSellData,
  monthSellData,
  yearSellData,
}) => {
  const { weekData, weekLebel, weekGrow, weekNewSell, weekTotalSell } =
    weekSellData;
  const { monthData, monthLabel, monthGrow, monthNewSell, monthTotalSell } =
    monthSellData;
  const { yrData, yrLebel, YrGrow, YrNewSell, YrTotalSell } = yearSellData;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [chart, setChart] = useState<any>({
    lebel: monthLabel,
    data: monthData,
    grow: monthGrow,
    newSell: monthNewSell,
    total: monthTotalSell,
  });
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleWeek = () => {
    setChart({
      lebel: weekLebel,
      data: weekData,
      grow: weekGrow,
      newSell: weekNewSell,
      total: weekTotalSell,
    });
  };
  const handleMonth = () => {
    setChart({
      lebel: monthLabel,
      data: monthData,
      grow: monthGrow,
      newSell: monthNewSell,
      total: monthTotalSell,
    });
  };
  const handleyear = () => {
    setChart({
      lebel: yrLebel,
      data: yrData,
      grow: YrGrow,
      newSell: YrNewSell,
      total: YrTotalSell,
    });
  };

  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        borderRadius: 2.5,
        border: `2px solid ${theme.palette.primary.light}`,
      })}
    >
      <Hidden mdUp>
        <Stack gap={0.5} p={2} justifyContent="center" alignItems="center">
          <Stack
            flexDirection="row"
            alignItems="center"
            onClick={handleClick}
            sx={{ cursor: "pointer" }}
            width={130}
          >
            <Typography variant="h5">
              {chart.lebel === weekLebel
                ? "Last Week"
                : chart.lebel === monthLabel
                ? "Last Month"
                : chart.lebel === yrLebel
                ? "This Year"
                : ""}
            </Typography>
            <IconButton sx={{ p: 0 }}>
              <ArrowDropDownIcon />
            </IconButton>
          </Stack>
        </Stack>
        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              handleClose(), handleWeek();
            }}
          >
            <Stack flexDirection="row" gap={0.5}>
              <Stack width={20} justifyContent="center" alignItems="center">
                {chart.lebel === weekLebel && (
                  <CheckCircleIcon
                    fontSize="small"
                    sx={(theme) => ({ color: theme.palette.success.light })}
                  />
                )}
              </Stack>
              <Typography> Last Week</Typography>
            </Stack>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose(), handleMonth();
            }}
          >
            <Stack flexDirection="row" gap={0.5}>
              <Stack width={20} justifyContent="center" alignItems="center">
                {chart.lebel === monthLabel && (
                  <CheckCircleIcon
                    fontSize="small"
                    sx={(theme) => ({ color: theme.palette.success.light })}
                  />
                )}
              </Stack>
              <Typography> Last Month</Typography>
            </Stack>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose(), handleyear();
            }}
          >
            <Stack flexDirection="row" gap={0.5}>
              <Stack width={20} justifyContent="center" alignItems="center">
                {chart.lebel === yrLebel && (
                  <CheckCircleIcon
                    fontSize="small"
                    sx={(theme) => ({ color: theme.palette.success.light })}
                  />
                )}
              </Stack>
              <Typography> Last Year</Typography>
            </Stack>
          </MenuItem>
        </Menu>
      </Hidden>
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        px={{ xs: 2, md: 4 }}
      >
        <Stack justifyContent="space-between" gap={0.5} width={80}>
          <Typography variant="subtitle1">Total Sell</Typography>
          <Typography variant="h5">{chart.total}</Typography>
        </Stack>
        <Stack justifyContent="space-between" gap={0.5} width={80}>
          <Typography variant="subtitle1">New Sell</Typography>
          <Typography variant="h5">{chart.newSell}</Typography>
        </Stack>
        <Stack justifyContent="space-between" gap={0.5} width={80}>
          <Typography variant="subtitle1">Groth</Typography>
          <Stack flexDirection="row" alignItems="center" gap={0.5}>
            <Typography
              color={chart.grow >= 0 ? "success.main" : "warning.main"}
              variant="h5"
            >
              {chart.grow}
              {"%"}
            </Typography>
            <IconButton sx={{ p: 0 }}>
              {chart.grow > 0 && (
                <ArrowUpwardIcon color="success" fontSize="small" />
              )}
              {chart.grow < 0 && (
                <ArrowDownwardIcon color="warning" fontSize="small" />
              )}
            </IconButton>
          </Stack>
        </Stack>
        <Hidden mdDown>
          <Stack justifyContent="space-between" width={130} gap={0.5}>
            <Typography variant="subtitle1">Period</Typography>
            <Stack
              flexDirection="row"
              alignItems="center"
              onClick={handleClick}
              sx={{ cursor: "pointer" }}
            >
              <Typography variant="h5">
                {chart.lebel === weekLebel
                  ? "Last Week"
                  : chart.lebel === monthLabel
                  ? "Last Month"
                  : chart.lebel === yrLebel
                  ? "This Year"
                  : ""}
              </Typography>
              <IconButton sx={{ p: 0 }}>
                <ArrowDropDownIcon />
              </IconButton>
            </Stack>
          </Stack>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => {
                handleClose(), handleWeek();
              }}
            >
              <Stack flexDirection="row" gap={0.5}>
                <Stack width={20} justifyContent="center" alignItems="center">
                  {chart.lebel === weekLebel && (
                    <CheckCircleIcon
                      fontSize="small"
                      sx={(theme) => ({ color: theme.palette.success.light })}
                    />
                  )}
                </Stack>
                <Typography> Last Week</Typography>
              </Stack>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose(), handleMonth();
              }}
            >
              <Stack flexDirection="row" gap={0.5}>
                <Stack width={20} justifyContent="center" alignItems="center">
                  {chart.lebel === monthLabel && (
                    <CheckCircleIcon
                      fontSize="small"
                      sx={(theme) => ({ color: theme.palette.success.light })}
                    />
                  )}
                </Stack>
                <Typography> Last Month</Typography>
              </Stack>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose(), handleyear();
              }}
            >
              <Stack flexDirection="row" gap={0.5}>
                <Stack width={20} justifyContent="center" alignItems="center">
                  {chart.lebel === yrLebel && (
                    <CheckCircleIcon
                      fontSize="small"
                      sx={(theme) => ({ color: theme.palette.success.light })}
                    />
                  )}
                </Stack>
                <Typography> Last Year</Typography>
              </Stack>
            </MenuItem>
          </Menu>
        </Hidden>
      </Stack>
      <BarChart
        xAxis={[
          {
            scaleType: "band",
            data: chart.lebel,
          },
        ]}
        series={[{ data: chart.data }]}
        height={317}
      ></BarChart>
    </Paper>
  );
};

export default SellStatistics;

"use client";
import { FC, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {
  Paper,
  Stack,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";

import { SellStatisticsProps } from "./Types";

const SellStatistics: FC<SellStatisticsProps> = ({ sellData }) => {
  const {
    monthData,
    monthLabel,
    yrData,
    yrLebel,
    weekData,
    weekLebel,
    grow,
    newSell,
    totalSell,
  } = sellData;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [chart, setChart] = useState<any>({
    lebel: monthLabel,
    data: monthData,
  });
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleWeek = () => {
    setChart({ lebel: weekLebel, data: weekData });
  };
  const handleMonth = () => {
    setChart({
      lebel: monthLabel,
      data: monthData,
    });
  };
  const handleyear = () => {
    setChart({
      lebel: yrLebel,
      data: yrData,
    });
  };

  return (
    <Paper>
      <Stack flexDirection="row" justifyContent="space-between" p={4}>
        <Stack justifyContent="space-between" gap={0.5}>
          <Typography variant="subtitle1">Total Sell</Typography>
          <Typography variant="h5">{totalSell}</Typography>
        </Stack>
        <Stack justifyContent="space-between" gap={0.5}>
          <Typography variant="subtitle1">New Sell</Typography>
          <Typography variant="h5">{newSell}</Typography>
        </Stack>
        <Stack justifyContent="space-between" gap={0.5}>
          <Typography variant="subtitle1">Groth</Typography>
          <Stack
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            gap={0.5}
          >
            <Typography variant="h5">
              {grow}
              {"%"}
            </Typography>
            <IconButton sx={{ p: 0 }}>
              {grow > 0 && <ArrowUpwardIcon fontSize="small" />}
              {grow < 0 && <ArrowDownwardIcon fontSize="small" />}
            </IconButton>
          </Stack>
        </Stack>
        <Stack justifyContent="space-between" gap={0.5}>
          <Typography variant="subtitle1">Period</Typography>
          <Stack
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            onClick={handleClick}
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
            Last Week
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose(), handleMonth();
            }}
          >
            Last Month
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose(), handleyear();
            }}
          >
            This year
          </MenuItem>
        </Menu>
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

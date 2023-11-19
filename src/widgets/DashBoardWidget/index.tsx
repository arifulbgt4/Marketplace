"use client";
import { FC } from "react";
import { IconButton, Stack, SvgIcon, Typography } from "@mui/material";

import { DashBoardWidgetProps } from "./Types";

const DashBoardWidget: FC<DashBoardWidgetProps> = ({
  icon,
  totalItem,
  totalValue,
}) => {
  return (
    <Stack
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      borderRadius={2.5}
      p={4}
      border={(theme) => `2px solid ${theme.palette.primary.light}`}
    >
      <Stack
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        gap={1}
      >
        <IconButton>
          <SvgIcon
            component={icon}
            inheritViewBox
            sx={(theme) => ({
              height: 32,
              width: 32,
              color:
                totalItem === "Total Product"
                  ? theme.palette.secondary.main
                  : totalItem === "Total Order"
                  ? theme.palette.warning.light
                  : totalItem === "Total Sell"
                  ? theme.palette.warning.main
                  : totalItem === "Total Customer"
                  ? theme.palette.primary.light
                  : "",
            })}
          />
        </IconButton>
        <Typography variant="subtitle1">{totalItem}</Typography>
      </Stack>
      <Typography variant="h5">{totalValue}</Typography>
    </Stack>
  );
};

export default DashBoardWidget;

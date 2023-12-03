"use client";
import { FC } from "react";
import { Avatar, Box, SvgIcon, Paper, Stack, Typography } from "@mui/material";

import { OrderCardProps } from "./Types";

const OrderCard: FC<OrderCardProps> = ({ orderTitle, icon, order }) => {
  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Stack
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
        pb={1}
      >
        <Avatar sx={(theme) => ({ bgcolor: theme.palette.primary.main })}>
          <SvgIcon component={icon} inheritViewBox />
        </Avatar>
      </Stack>

      <Box>
        <Typography variant="h6">{orderTitle}</Typography>
        <Typography variant="h3">{order}</Typography>
      </Box>
    </Paper>
  );
};

export default OrderCard;

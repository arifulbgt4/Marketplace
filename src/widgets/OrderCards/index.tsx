import { FC } from "react";
import {
  Box,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import CloseIcon from "@mui/icons-material/Close";
import CachedIcon from "@mui/icons-material/Cached";

import OrderCard from "../OrederCard";

import { OrderCardsProps } from "./Types";

const OrderCards: FC<OrderCardsProps> = ({ avRating, orderData }) => {
  const { view, rate } = avRating;
  const { orderComlete, orderConfirm, orderCancle, orderRefound } = orderData;
  return (
    <Grid container rowSpacing={4}>
      <Grid item xs={12}>
        <Stack component={Paper} p={3} gap={2.6} borderRadius={2}>
          <Typography variant="h5">Average Rate (%)</Typography>
          <Box>
            <Typography variant="body2">Product Views</Typography>
            <Stack gap={1} flexDirection="row" alignItems="center">
              <Box width="100% ">
                <LinearProgress variant="determinate" value={60} />
              </Box>
              <Typography variant="body2">
                {view}
                {"%"}
              </Typography>
            </Stack>
            <Typography variant="body2">Cart Abandonment Rate</Typography>
            <Stack gap={1} flexDirection="row" alignItems="center">
              <Box width="100% ">
                <LinearProgress variant="determinate" value={23} />
              </Box>
              <Typography variant="body2">
                {rate}
                {"%"}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={12} container rowSpacing={4}>
        <Grid item xs={12}>
          <OrderCard
            orderTitle="Orders Completed"
            icon={ShoppingCartIcon}
            order={orderComlete}
          />
        </Grid>
        <Grid item xs={12}>
          <OrderCard
            orderTitle="Orders Confirmed"
            icon={FormatAlignLeftIcon}
            order={orderConfirm}
          />
        </Grid>
        <Grid item xs={12}>
          <OrderCard
            orderTitle="OOrders Canceled"
            icon={CloseIcon}
            order={orderCancle}
          />
        </Grid>
        <Grid item xs={12}>
          <OrderCard
            orderTitle="Orders on Refound"
            icon={CachedIcon}
            order={orderRefound}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default OrderCards;

"use client";
import { useState, useEffect } from "react";
import {
  Button,
  Grid,
  Stack,
  Typography,
  Hidden,
  Box,
  Drawer,
  IconButton,
  Paper,
  Skeleton,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import OrderCards from "src/widgets/OrderCards";
import OrderDetails from "src/widgets/OrderDetails";
import { getUserOrders } from "src/server/order";

const Order = () => {
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const orderData = {
    orderComlete: orders.filter((o) => o.status === "completed").length,
    orderConfirm: orders.filter((o) => o.status === "confirmed").length,
    orderCancle: orders.filter((o) => o.status === "cancelled").length,
    orderRefound: 0,
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Hidden mdUp implementation="css">
        <Box pb={2} display="flex" justifyContent="center">
          <Button
            endIcon={<ArrowForwardIcon fontSize="small" />}
            disableRipple
            onClick={handleDrawerOpen}
            variant="contained"
          >
            Order
          </Button>
        </Box>
        <Drawer open={open} onClose={handleDrawerClose} anchor="bottom">
          <Paper>
            <Stack
              bgcolor="background.paper"
              justifyContent="center"
              alignItems="center"
              position="fixed"
              width="100%"
              pt={1}
            >
              <IconButton
                sx={{ boxShadow: 2, bgcolor: "gray" }}
                onClick={handleDrawerClose}
              >
                <CloseIcon />
              </IconButton>
            </Stack>
            <Box sx={{ pt: 10, px: 2 }}>
              <Grid item xs={12} md={3} gap={4} container>
                <Grid item xs={12} container gap={2}>
                  <Typography variant="h3">Order</Typography>
                  <Button variant="outlined" endIcon={<CalendarMonthIcon />}>
                    All Orders
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  {loading ? (
                    <Skeleton variant="rounded" height={150} />
                  ) : (
                    <OrderCards
                      orderData={orderData}
                      avRating={{ view: orders.length, rate: 0 }}
                    />
                  )}
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Drawer>
      </Hidden>
      <Grid container spacing={4}>
        <Hidden mdDown implementation="css">
          <Grid item md={2} gap={4} container>
            <Grid item xs={12} container gap={2}>
              <Typography variant="h3">Order</Typography>
              <Button variant="outlined" endIcon={<CalendarMonthIcon />}>
                All Orders
              </Button>
            </Grid>
            <Grid item md={12}>
              {loading ? (
                <Skeleton variant="rounded" height={150} />
              ) : (
                <OrderCards
                  orderData={orderData}
                  avRating={{ view: orders.length, rate: 0 }}
                />
              )}
            </Grid>
          </Grid>
        </Hidden>
        <Grid item xs={12} md={10}>
          {loading ? (
            <Stack spacing={2}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} variant="rounded" height={80} />
              ))}
            </Stack>
          ) : (
            <OrderDetails orderDetailsData={orders} />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Order;

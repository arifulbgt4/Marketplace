"use client";
import { useState } from "react";
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
} from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import OrderCards from "src/widgets/OrderCards";
import OrderDetails from "src/widgets/OrderDetails";
import { orderDetailsData } from "src/global/staticData";

const orderData = {
  orderComlete: 1232,
  orderConfirm: 4321,
  orderCancle: 123,
  orderRefound: 432,
};

const Order = () => {
  const [open, setOpen] = useState(false);

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
                    08/12/2023-08/24/2023
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <OrderCards
                    orderData={orderData}
                    avRating={{ view: 60, rate: 34 }}
                  />
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
                08/12/2023-08/24/2023
              </Button>
            </Grid>
            <Grid item md={12}>
              <OrderCards
                orderData={orderData}
                avRating={{ view: 60, rate: 34 }}
              />
            </Grid>
          </Grid>
        </Hidden>
        <Grid item xs={12} md={10}>
          <OrderDetails orderDetailsData={orderDetailsData} />
        </Grid>
      </Grid>
    </>
  );
};

export default Order;

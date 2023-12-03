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
      <Stack
        flexDirection={{ md: "row" }}
        justifyContent="space-between"
        alignItems={{ md: "center" }}
        pb={{ xs: 1, md: 3 }}
      >
        <Hidden mdDown>
          <Typography variant="h3">Order</Typography>
        </Hidden>
        <Stack flexDirection={{ md: "row" }} gap={{ xs: 0.5, md: 1 }}>
          <Button endIcon={<CachedIcon />}>Data Refreshed</Button>
          <Button variant="outlined">September 28, 2023 12:35 PM</Button>
        </Stack>
      </Stack>
      <Stack
        flexDirection={{ md: "row" }}
        justifyContent="space-between"
        alignItems={{ md: "center" }}
        pb={{ xs: 2, md: 5 }}
        gap={{ xs: 0.5, md: 0 }}
      >
        <Button variant="outlined" endIcon={<CalendarMonthIcon />}>
          08/12/2023-08/24/2023
        </Button>
        <Stack flexDirection={{ md: "row" }} gap={{ xs: 0.5, md: 1 }}>
          <Button variant="outlined" endIcon={<ArrowDropDownIcon />}>
            Product Category
          </Button>
          <Button variant="outlined" endIcon={<ArrowDropDownIcon />}>
            Sort by: Best Seller
          </Button>
        </Stack>
      </Stack>
      <Hidden mdUp>
        <Box pb={2} display="flex" justifyContent="center">
          <Button disableRipple onClick={handleDrawerOpen} variant="contained">
            see order <ArrowForwardIcon />
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
            <Box sx={{ pt: 4, px: 2 }}>
              <OrderDetails orderDetailsData={orderDetailsData} />
            </Box>
          </Paper>
        </Drawer>
      </Hidden>
      <Grid container columnSpacing={5}>
        <Grid item xs={12} md={3}>
          <OrderCards orderData={orderData} avRating={{ view: 60, rate: 34 }} />
        </Grid>
        <Hidden mdDown>
          <Grid item xs={12} md={9}>
            <OrderDetails orderDetailsData={orderDetailsData} />
          </Grid>
        </Hidden>
      </Grid>
    </>
  );
};

export default Order;

import { Button, Grid, Stack, Typography } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

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
  return (
    <>
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        pb={3}
      >
        <Typography variant="h3">Order</Typography>
        <Stack flexDirection="row" gap={1}>
          <Button endIcon={<CachedIcon />}>Data Refreshed</Button>
          <Button variant="outlined">September 28, 2023 12:35 PM</Button>
        </Stack>
      </Stack>
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        pb={5}
      >
        <Button variant="outlined" endIcon={<CalendarMonthIcon />}>
          08/12/2023-08/24/2023
        </Button>
        <Stack flexDirection="row" gap={1}>
          <Button variant="outlined" endIcon={<ArrowDropDownIcon />}>
            Product Category
          </Button>
          <Button variant="outlined" endIcon={<ArrowDropDownIcon />}>
            Sort by: Best Seller
          </Button>
        </Stack>
      </Stack>
      <Grid container columnSpacing={5}>
        <Grid item xs={3}>
          <OrderCards orderData={orderData} avRating={{ view: 60, rate: 34 }} />
        </Grid>
        <Grid item xs={9}>
          <OrderDetails orderDetailsData={orderDetailsData} />
        </Grid>
      </Grid>
    </>
  );
};

export default Order;

"use client";
import { FC, useState } from "react";
import {
  Paper,
  Stack,
  Typography,
  Divider,
  Button,
  Rating,
  Select,
  InputLabel,
  Box,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";

import { ListingBookingProps } from "./Types";

const ListingBooking: FC<ListingBookingProps> = () => {
  const [gest, setGest] = useState("");

  const handleChange = (event: any) => {
    setGest(event.target.value as string);
  };

  return (
    <Paper>
      <Stack py={5} px={3} gap={3}>
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5">$500/month</Typography>
          <Stack flexDirection="row">
            <Rating defaultValue={1} max={1} />
            <Typography>12 reviews</Typography>
          </Stack>
        </Stack>
        <Stack>
          <Stack flexDirection="row" justifyContent="space-between" pr={5.8}>
            <Typography>Check-in</Typography>
            <Typography>Checkout</Typography>
          </Stack>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
              defaultRangePosition="end"
              localeText={{ start: "", end: "" }}
            />
          </LocalizationProvider>
        </Stack>
        <Box>
          <InputLabel>Gestes</InputLabel>
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={gest}
              onChange={handleChange}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button variant="contained" size="large">
          reserve
        </Button>
        <Typography textAlign="center">You won't be charged yet</Typography>
        <Stack gap={2}>
          <Stack flexDirection="row" justifyContent="space-between">
            <Typography>$500 x 5 month</Typography>
            <Typography>$2500</Typography>
          </Stack>
          <Stack flexDirection="row" justifyContent="space-between">
            <Typography>Long stay discount</Typography>
            <Typography>-$100</Typography>
          </Stack>
          <Stack flexDirection="row" justifyContent="space-between">
            <Typography>Airbnb service fee</Typography>
            <Typography>$150</Typography>
          </Stack>
        </Stack>
        <Divider></Divider>
        <Stack flexDirection="row" justifyContent="space-between">
          <Typography variant="h6">Total before taxes</Typography>
          <Typography>$2550</Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default ListingBooking;

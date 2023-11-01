"use client";
import { FC, useState, ReactNode } from "react";
import { Form as FinalForm } from "react-final-form";
import moment, { Moment } from "moment";

import { DateRangePicker, FocusedInputShape } from "react-dates";
import {
  Paper,
  Stack,
  Typography,
  Divider,
  Button,
  Rating,
  InputLabel,
  Box,
  MenuItem,
  FormControl,
} from "@mui/material";

import { Select } from "src/components/Input";

import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

import { BookingFormProps } from "./Types";

const BookingForm: FC<BookingFormProps> = () => {
  const gest = "";
  const onSubmitForm = async () => {};
  const [startDate, setStartDate] = useState<Moment | null>(moment());
  const [endDate, setEndDate] = useState<Moment | null>(null);
  const [focusedInput, setFocusedInput] = useState<FocusedInputShape | null>(
    null
  );

  const handlendDatesChange = (arg: {
    startDate: Moment | null;
    endDate: Moment | null;
  }) => {
    setStartDate(arg.startDate);
    setEndDate(arg.endDate);
  };

  const handleFocusChange = (arg: FocusedInputShape | null) => {
    setFocusedInput(arg);
  };
  return (
    <Paper>
      <FinalForm
        onSubmit={onSubmitForm}
        render={({ handleSubmit, values, errors, submitting }) => {
          return (
            <form onSubmit={handleSubmit}>
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
                  <Stack
                    flexDirection="row"
                    justifyContent="space-between"
                    pr={5.8}
                  >
                    <Typography>Check-in</Typography>
                    <Typography>Checkout</Typography>
                  </Stack>
                  <DateRangePicker
                    startDate={startDate} // moment.Moment | null;
                    startDateId="your_unique_start_date_id" // moment.Moment | null;
                    endDate={endDate} // momentPropTypes.momentObj or null,
                    endDateId="your_unique_end_date_id" // string;
                    onDatesChange={handlendDatesChange} // (arg: { startDate: moment.Moment | null; endDate: moment.Moment | null }) => void;
                    focusedInput={focusedInput} // FocusedInputShape | null;
                    onFocusChange={handleFocusChange} // (arg: FocusedInputShape | null) => void;
                  />
                </Stack>
                <Box>
                  <InputLabel>Gestes</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      labelId="gestes-select-label"
                      id="gestes-select"
                      value={gest}
                      name="gestes"
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
                <Typography textAlign="center">
                  You won't be charged yet
                </Typography>
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
            </form>
          );
        }}
      />
    </Paper>
  );
};

export default BookingForm;

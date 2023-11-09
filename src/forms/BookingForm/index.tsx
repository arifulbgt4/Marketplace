"use client";
import { FC } from "react";
import {
  Paper,
  Stack,
  Typography,
  Divider,
  Button,
  Rating,
  InputLabel,
  Box,
} from "@mui/material";
import { Form as FinalForm } from "react-final-form";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

import { Select, DateRangePicker } from "src/components/Input";

import { BookingFormProps } from "./Types";
import { siteConfig } from "src/global/config";

const BookingForm: FC<BookingFormProps> = () => {
  const onSubmitForm = async () => {};

  return (
    <Paper
      sx={(theme) => ({
        p: 3,
        borderRadius: 3,
      })}
    >
      <FinalForm
        onSubmit={onSubmitForm}
        render={({ handleSubmit, values, errors, submitting }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Stack gap={3}>
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
                  <DateRangePicker
                    name="dateRange"
                    renderPreview={(startDate, endDate) => (
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Typography variant="subtitle1">Check-in</Typography>
                          <Stack
                            p={2}
                            alignItems="center"
                            border={(theme) =>
                              `1px solid ${theme.palette.action.focus}`
                            }
                            width="100%"
                            color="text.secondary"
                          >
                            {startDate}
                          </Stack>
                        </Box>
                        <Box>
                          <Typography variant="subtitle1">Checkout</Typography>
                          <Stack
                            p={2}
                            alignItems="center"
                            border={(theme) =>
                              `1px solid ${theme.palette.action.focus}`
                            }
                            width="100%"
                            color="text.secondary"
                          >
                            {endDate}
                          </Stack>
                        </Box>
                      </Stack>
                    )}
                  />
                </Stack>
                <Box>
                  <InputLabel>Gestes</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      labelId="gestes-select-label"
                      id="gestes-select"
                      name="gestes"
                      size="small"
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                      <MenuItem value={3}>3</MenuItem>
                      <MenuItem value={4}>4</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Button variant="contained">reserve</Button>
              </Stack>
              <Stack alignItems="center" py={1}>
                <Typography variant="subtitle2" sx={{ my: 1 }}>
                  You won't be charged yet
                </Typography>
              </Stack>
              <Stack gap={1}>
                <Stack flexDirection="row" justifyContent="space-between">
                  <Typography variant="body2">$500 x 5 month</Typography>
                  <Typography variant="body2">$2500</Typography>
                </Stack>
                <Stack flexDirection="row" justifyContent="space-between">
                  <Typography variant="body2">Long stay discount</Typography>
                  <Typography variant="body2">-$100</Typography>
                </Stack>
                <Stack flexDirection="row" justifyContent="space-between">
                  <Typography variant="body2">
                    {siteConfig.name} service fee
                  </Typography>
                  <Typography variant="body2">$150</Typography>
                </Stack>
              </Stack>
              <Divider
                sx={{
                  mt: 2,
                }}
              />
              <Stack
                flexDirection="row"
                justifyContent="space-between"
                pt={0.5}
              >
                <Typography variant="subtitle1">Total before taxes</Typography>
                <Typography variant="h6">$2550</Typography>
              </Stack>
            </form>
          );
        }}
      />
    </Paper>
  );
};

export default BookingForm;

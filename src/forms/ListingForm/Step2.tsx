import { FC } from "react";
import {
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import { TextField } from "src/components/Input";
import CalendarComp from "src/widgets/CalendarComp";

import { Step2Props } from "./Types";

const Step2: FC<Step2Props> = () => {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h6" textAlign="center">
          Price Information
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>category</InputLabel>
          <Select name="category" input={<OutlinedInput label="category" />}>
            <MenuItem value="">
              <em>None Selected</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} container spacing={2}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <TextField
              name="monthlyrent"
              label="Monthly Rent"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Sequrity Deposit
            </InputLabel>
            <Select
              name="deposit"
              input={<OutlinedInput label="Sequrity Deposit" />}
            >
              <MenuItem value="1">1/2 Month</MenuItem>
              <MenuItem value="2">Ten</MenuItem>
              <MenuItem value="3">Twenty</MenuItem>
              <MenuItem value="4">Thirty</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid item xs={12} container spacing={2}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <CalendarComp />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Lease term</InputLabel>
            <Select
              fullWidth
              name="sdeposit"
              input={<OutlinedInput label="lease term" />}
            >
              <MenuItem value="1">long term</MenuItem>
              <MenuItem value="2">short term</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Step2;

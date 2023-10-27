import { FC } from "react";

import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Typography,
} from "@mui/material";

import { Select } from "src/components/Input";

import { SelectSearchFilterProps } from "./Types";

const SelectSearchFilter: FC<SelectSearchFilterProps> = () => {
  const selectitems = "";
  return (
    <Grid container gap={2}>
      <Grid item xs={12}>
        <Typography variant="h5">Bedrooms</Typography>
      </Grid>
      <Grid item xs={5}>
        <Typography variant="subtitle1">Min beds</Typography>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">No Min</InputLabel>
          <Select value={selectitems} name="minbeds">
            <MenuItem value={0}>min</MenuItem>
            <MenuItem value={1}>nomin</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={5}>
        <Typography variant="subtitle1">Max beds</Typography>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">no Max</InputLabel>
          <Select id="demo-simple-select" value={selectitems} name="maxbeds">
            <MenuItem value={0}>max</MenuItem>
            <MenuItem value={1}>nomax</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default SelectSearchFilter;

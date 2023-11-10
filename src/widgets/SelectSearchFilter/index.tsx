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
        <Typography variant="subtitle1">Radius</Typography>
        <FormControl fullWidth size="small">
          <InputLabel id="radius-label">There are only</InputLabel>
          <Select
            size="small"
            id="radius-select"
            value={selectitems}
            name="radius"
          >
            <MenuItem value={0}>sample1</MenuItem>
            <MenuItem value={1}>sample2</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} container gap={2}>
        <Grid item xs={12}>
          <Typography variant="h5">Bedrooms</Typography>
        </Grid>
        <Grid item xs={12} columnSpacing={2} container>
          <Grid item xs={6}>
            <Typography variant="subtitle1">Min beds</Typography>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">No Min</InputLabel>
              <Select value={selectitems} name="minbeds" size="small">
                <MenuItem value={0}>min</MenuItem>
                <MenuItem value={1}>nomin</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1">Max beds</Typography>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">No Max</InputLabel>
              <Select
                size="small"
                id="demo-simple-select"
                value={selectitems}
                name="maxbeds"
              >
                <MenuItem value={0}>max</MenuItem>
                <MenuItem value={1}>nomax</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SelectSearchFilter;

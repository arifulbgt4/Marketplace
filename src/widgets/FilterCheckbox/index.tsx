"use client";
import { FC } from "react";
import {
  FormControl,
  FormGroup,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";

import { Checkbox } from "src/components/Input";

import { FilterCheckboxProps } from "./Types";

const FilterCheckbox: FC<FilterCheckboxProps> = ({ title, checkbox }) => {
  return (
    <Grid container rowGap={2} pb={2}>
      <Grid item xs={12}>
        <Typography variant="h5">{title}</Typography>
      </Grid>

      <Grid item xs={12} container rowSpacing={2}>
        {checkbox.map((data) => {
          const { label, value } = data;
          return (
            <Grid item xs={6} key={value}>
              <FormControl component="fieldset" variant="standard" size="small">
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox size="small" name={value} />}
                    label={label}
                  />
                </FormGroup>
              </FormControl>
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};

export default FilterCheckbox;

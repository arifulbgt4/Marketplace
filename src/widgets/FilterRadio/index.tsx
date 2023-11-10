import { FC } from "react";

import {
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  Typography,
} from "@mui/material";

import { RadioGroup } from "src/components/Input";

import { FilterRadioProps } from "./Types";

const FilterRadio: FC<FilterRadioProps> = ({ title, radio }) => {
  return (
    <Grid container rowGap={2}>
      <Grid item xs={12}>
        <Typography variant="h5">{title}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container rowSpacing={2} pb={2}>
          {radio.map((data) => {
            const { label, value } = data;
            return (
              <Grid item xs={6} key={label}>
                <FormControl
                  component="fieldset"
                  variant="standard"
                  size="small"
                >
                  <RadioGroup name="customized-radios">
                    <FormControlLabel
                      value={value}
                      control={<Radio size="small" />}
                      label={label}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FilterRadio;

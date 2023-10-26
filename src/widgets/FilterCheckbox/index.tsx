"use client";
import { FC } from "react";
import { Box, Grid, Typography } from "@mui/material";

import { Checkbox } from "src/components/Input";
import { Form as FinalForm } from "react-final-form";
import FilterCheckboxForm from "../../forms/FilterCheckboxForm/index";
import { checkbox } from "src/global/staticData/index";
import { FilterCheckboxProps } from "./Types";

const FilterCheckbox: FC<FilterCheckboxProps> = ({ title }) => {
  return (
    <Grid container rowGap={2}>
      <Grid item xs={12}>
        <Typography variant="h5">{title}</Typography>
      </Grid>
      <Grid xs={12}>
        <FilterCheckboxForm checkbox={checkbox} />
      </Grid>
    </Grid>
  );
};

export default FilterCheckbox;

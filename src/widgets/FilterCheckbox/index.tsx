"use client";
import { FC } from "react";
import { Box, Grid, Typography } from "@mui/material";

import { Checkbox } from "src/components/Input";
import { Form as FinalForm } from "react-final-form";
import { checkbox } from "../../global/staticData/index";
import FilterCheckboxForm from "../../forms/FilterCheckboxForm/index";

import { FilterCheckboxProps } from "./Types";

const FilterCheckbox: FC<FilterCheckboxProps> = ({ title }) => {
  return (
    <Grid container rowGap={2}>
      <Grid item xs={12}>
        <Typography variant="h5">{title}</Typography>
      </Grid>
      <Grid xs={12}>
        <FilterCheckboxForm />
      </Grid>
    </Grid>
  );
};

export default FilterCheckbox;

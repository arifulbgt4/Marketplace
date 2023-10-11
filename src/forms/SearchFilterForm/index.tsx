"use client";
import { FC, useState } from "react";
import { Autocomplete, Paper, FormControl, TextField } from "@mui/material";

import { SearchFilterFormProps } from "./Types";
import { listings } from "src/global/staticData";

const SearchFilterForm: FC<SearchFilterFormProps> = ({}) => {
  const searchingProps = {
    options: listings.map((data) => data.title),
  };
  const [value, setValue] = useState(null);
  return (
    <Paper>
      <Autocomplete
        {...searchingProps}
        disablePortal
        id="combo-box-demo"
        renderInput={(params) => (
          <TextField name="search" {...params} label="Search" />
        )}
      />
    </Paper>
  );
};

export default SearchFilterForm;

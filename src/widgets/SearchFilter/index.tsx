import { Paper } from "@mui/material";
import { FC } from "react";

import { SearchFilterProps } from "./Types";
import SearchFilterForm from "src/forms/SearchFilterForm";

const SearchFilter: FC<SearchFilterProps> = () => {
  return (
    <Paper>
      <SearchFilterForm />
    </Paper>
  );
};

export default SearchFilter;

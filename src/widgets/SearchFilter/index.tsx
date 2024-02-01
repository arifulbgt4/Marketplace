import { Paper } from "@mui/material";
import { FC, Suspense } from "react";

import { SearchFilterProps } from "./Types";
import SearchFilterForm from "src/forms/SearchFilterForm";

const SearchFilter: FC<SearchFilterProps> = () => {
  return (
    <Paper>
      <Suspense>
        <SearchFilterForm />
      </Suspense>
    </Paper>
  );
};

export default SearchFilter;

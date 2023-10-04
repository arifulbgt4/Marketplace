import { FC } from "react";
import { FormControl, Paper } from "@mui/material";

import { SearchFilterFormProps } from "./Types";

const SearchFilterForm: FC<SearchFilterFormProps> = () => {
  return (
    <Paper>
      <FormControl>SearchFilterForm</FormControl>;
    </Paper>
  );
};

export default SearchFilterForm;

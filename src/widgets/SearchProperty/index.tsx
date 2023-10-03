import { FC } from "react";
import { Paper, TextField, Box } from "@mui/material";

import { SearchPropertyProps } from "./Types";

const SearchProperty: FC<SearchPropertyProps> = () => {
  return (
    <Paper>
      <Box component="form" p={2} noValidate autoComplete="off">
        <TextField label="Search" variant="outlined" />
      </Box>
    </Paper>
  );
};

export default SearchProperty;

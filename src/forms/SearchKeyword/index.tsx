import React, { FC } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import { SearchKeywordProps } from "./Types";

const SearchKeyword: FC<SearchKeywordProps> = ({ size }) => {
  return (
    <Autocomplete
      sx={{
        pl: { xs: 1, md: 2 },
      }}
      id="search keyword"
      freeSolo
      size="small"
      noOptionsText="No product"
      autoComplete
      includeInputInList
      filterSelectedOptions
      options={top100Films}
      getOptionLabel={(option) =>
        typeof option === "string" ? "" : option?.title
      }
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          variant="filled"
          label="What?"
          sx={{ label: { pt: { md: 1.4 }, fontWeight: 500 } }}
        />
      )}
    />
  );
};

export default SearchKeyword;

const top100Films = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 },
];

import React, { FC } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import { SearchKeywordProps } from "./Types";
// import { TextField } from "src/components/Input";

const SearchKeyword: FC<SearchKeywordProps> = ({ size }) => {
  return (
    <Autocomplete
      sx={{
        pl: 2,
        "& .MuiInputLabel-root": {
          pt: 1.6,
        },
      }}
      id="size-small-standard"
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
      defaultValue={top100Films[1]}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="filled"
          label="What?"
          placeholder="KeyWord"
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

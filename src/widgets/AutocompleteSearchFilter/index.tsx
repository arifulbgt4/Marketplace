import { FC } from "react";
import { Autocomplete, TextField, Box, Typography } from "@mui/material";

import { AutocompleteSearchFilterProps } from "./Types";

const AutocompleteSearchFilter: FC<AutocompleteSearchFilterProps> = () => {
  return (
    <Box py={2}>
      <Typography variant="h5" pb={2}>
        Keywords
      </Typography>
      <Autocomplete
        multiple
        id="multiple-limit-tags"
        options={top100Flats}
        getOptionLabel={(option) => option.title}
        renderInput={(params) => (
          <TextField {...params} placeholder="Keyword" />
        )}
      />
    </Box>
  );
};

export default AutocompleteSearchFilter;

const top100Flats = [
  { title: "Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: "Pulp Fiction", year: 1994 },
];

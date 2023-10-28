import { FC, useState } from "react";
import { Autocomplete, Chip, TextField, Box, Typography } from "@mui/material";

import { AutocompleteSearchFilterProps } from "./Types";

const AutocompleteSearchFilter: FC<AutocompleteSearchFilterProps> = () => {
  const fixedOptions = [top100Flats[0]];
  const [value, setValue] = useState([...fixedOptions]);
  return (
    <Box py={2}>
      <Typography variant="h5" pb={2}>
        Keywords
      </Typography>
      <Autocomplete
        multiple
        id="fixed-tags-demo"
        value={value}
        onChange={(event, newValue) => {
          setValue([
            ...fixedOptions,
            ...newValue.filter((option) => fixedOptions.indexOf(option) === -1),
          ]);
        }}
        options={top100Flats}
        getOptionLabel={(option) => option.title}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              label={option.title}
              {...getTagProps({ index })}
              disabled={fixedOptions.indexOf(option) !== -1}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Keywords"
            helperText="Helper text"
          />
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

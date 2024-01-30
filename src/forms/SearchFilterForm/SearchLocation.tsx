import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { debounce } from "@mui/material/utils";

import getLocations from "./action";

import { PlaceType, SearchLocationProps } from "./Types";
// import { TextField } from "src/components/Input";

export default function SearchLocation({ size }: SearchLocationProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState<readonly PlaceType[]>([]);

  const fetchLocation = React.useMemo(
    () =>
      debounce(
        async (
          request: { input: string },
          callback: (results?: readonly PlaceType[]) => void
        ) => {
          const data = await getLocations(request.input);
          callback(data?.features as PlaceType[]);
        },
        400
      ),
    []
  );

  React.useEffect(() => {
    let active = true;

    fetchLocation({ input: inputValue }, (results?: readonly PlaceType[]) => {
      if (active) {
        let newOptions: readonly PlaceType[] = [];

        if (results?.length) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [inputValue, fetchLocation]);

  return (
    <Autocomplete
      id="mapbox-search"
      freeSolo
      sx={{ width: "auto", pl: 2 }}
      getOptionLabel={(option) =>
        typeof option === "string" ? "" : option?.properties?.place_formatted
      }
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      noOptionsText="No locations"
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Where?"
          placeholder="Location"
          fullWidth
          variant="filled"
        />
      )}
      renderOption={(props, option: PlaceType) => {
        return (
          <li {...props} key={option?.id}>
            <Grid container alignItems="center">
              <Grid item sx={{ display: "flex", width: 44 }}>
                <LocationOnIcon sx={{ color: "text.secondary" }} />
              </Grid>
              <Grid
                item
                sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}
              >
                <Box component="span" sx={{ fontWeight: "bold" }}>
                  {option?.properties?.name}
                </Box>

                <Typography variant="body2" color="text.secondary">
                  {option?.properties?.place_formatted}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
}

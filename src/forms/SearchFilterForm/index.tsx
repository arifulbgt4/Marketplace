"use client";
import { FC } from "react";
import { Form as FinalForm } from "react-final-form";
import { Paper, Hidden, Button, Grid, InputAdornment } from "@mui/material";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import LocationOnSharpIcon from "@mui/icons-material/LocationOnSharp";
import IconButton from "@mui/material/IconButton";

import { TextField } from "src/components/Input";

import { SearchFilterFormProps } from "./Types";

const SearchFilterForm: FC<SearchFilterFormProps> = ({}) => {
  const onSubmitForm = async () => {};

  return (
    <Paper>
      <FinalForm
        onSubmit={onSubmitForm}
        render={({ handleSubmit, values, errors, submitting }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Grid container>
                <Grid item xs={5.5} md={5}>
                  <TextField
                    label="Location"
                    name="location"
                    id="outlined-adornment-location"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <LocationOnSharpIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={5.5} md={5}>
                  <TextField
                    name="key"
                    id="outlined-adornment-key"
                    label="Keyword"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <SearchSharpIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={1} md={2}>
                  <Hidden mdDown>
                    <Button fullWidth variant="contained" sx={{ py: 2 }}>
                      Search
                    </Button>
                  </Hidden>

                  <Hidden mdUp>
                    <IconButton
                      sx={(theme) => ({
                        bgcolor: theme.palette.primary.dark,
                        borderRadius: 0.5,
                        width: "100%",
                        py: 2,
                      })}
                    >
                      <SearchSharpIcon />
                    </IconButton>
                  </Hidden>
                </Grid>
              </Grid>
            </form>
          );
        }}
      />
    </Paper>
  );
};

export default SearchFilterForm;

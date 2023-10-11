"use client";
import { FC, useState } from "react";
import {
  Paper,
  FormControl,
  Button,
  Grid,
  InputLabel,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import LocationOnSharpIcon from "@mui/icons-material/LocationOnSharp";
import IconButton from "@mui/material/IconButton";

import { Form as FinalForm } from "react-final-form";

import { SearchFilterFormProps } from "./Types";

const SearchFilterForm: FC<SearchFilterFormProps> = ({}) => {
  const onSubmitForm = async () => {};

  return (
    <Paper sx={{ p: 1 }}>
      <FinalForm
        onSubmit={onSubmitForm}
        render={({ handleSubmit, values, errors, submitting }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Grid container>
                <Grid item xs={12} md={5}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-location">
                      Location
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-location"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton>
                            <LocationOnSharpIcon />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={5}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-listing">
                      Key
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton>
                            <SearchSharpIcon />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button fullWidth variant="contained" sx={{ py: 2 }}>
                    Search
                  </Button>
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

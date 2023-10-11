"use client";
import { FC, useState } from "react";
import {
  Paper,
  FormControl,
  FilledInput,
  Button,
  Grid,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import LocationOnSharpIcon from "@mui/icons-material/LocationOnSharp";
import IconButton from "@mui/material/IconButton";

import { Form as FinalForm } from "react-final-form";

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
                <Grid item xs={4}>
                  <FormControl sx={{ p: 1, width: "25ch" }} variant="filled">
                    <InputLabel htmlFor="filled-adornment-location">
                      Location
                    </InputLabel>
                    <FilledInput
                      id="filled-adornment-location"
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
                <Grid item xs={4}>
                  <FormControl sx={{ m: 1, width: "25ch" }} variant="filled">
                    <InputLabel htmlFor="filled-adornment-password">
                      Key
                    </InputLabel>
                    <FilledInput
                      id="filled-adornment-password"
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
                <Grid item xs={4} pt={2}>
                  <Button variant="contained">Search</Button>
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

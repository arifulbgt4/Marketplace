"use client";
import { FC } from "react";
import { Form as FinalForm } from "react-final-form";
import {
  Paper,
  Hidden,
  Button,
  Grid,
  InputAdornment,
  Stack,
  Box,
} from "@mui/material";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import LocationOnSharpIcon from "@mui/icons-material/LocationOnSharp";
import IconButton from "@mui/material/IconButton";

import { TextField } from "src/components/Input";

import { SearchFilterFormProps } from "./Types";

const SearchFilterForm: FC<SearchFilterFormProps> = ({}) => {
  const onSubmitForm = async () => {};

  return (
    <FinalForm
      onSubmit={onSubmitForm}
      render={({ handleSubmit, values, errors, submitting }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={(theme) => ({
                background: theme.palette.background.paper,
                py: 2,
                px: 3,
                borderRadius: 10,
              })}
            >
              <TextField
                fullWidth
                name="key"
                placeholder="Keyword"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchSharpIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                placeholder="Location"
                name="location"
                variant="outlined"
                size="small"
                sx={{
                  borderColor: "transparent",
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnSharpIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <Box ml={0.5}>
                <IconButton
                  size="large"
                  sx={(theme) => ({
                    background: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    ":hover": {
                      background: theme.palette.primary.dark,
                    },
                  })}
                >
                  <SearchSharpIcon fontSize="inherit" />
                </IconButton>
              </Box>
            </Stack>
          </form>
        );
      }}
    />
  );
};

export default SearchFilterForm;

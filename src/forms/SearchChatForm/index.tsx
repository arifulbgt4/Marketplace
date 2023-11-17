"use client";
import { FC } from "react";
import { Form as FinalForm } from "react-final-form";
import { IconButton, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { TextField } from "src/components/Input";

import { SearchChatFormProps } from "./Types";

const SearchChatForm: FC<SearchChatFormProps> = () => {
  const onSubmitForm = async () => {};
  return (
    <FinalForm
      onSubmit={onSubmitForm}
      render={({ handleSubmit, values, errors, submitting }) => {
        return (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="search"
              placeholder="search"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </form>
        );
      }}
    />
  );
};
export default SearchChatForm;

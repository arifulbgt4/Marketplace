"use client";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { Form as FinalForm } from "react-final-form";
import { InputAdornment, Stack, Box, Button } from "@mui/material";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import LocationOnSharpIcon from "@mui/icons-material/LocationOnSharp";

import { TextField } from "src/components/Input";
import { useQueryString } from "src/global/hooks";
import routes from "src/global/routes";

import { FIELDS, SearchFilterFormProps } from "./Types";

const SearchFilterForm: FC<SearchFilterFormProps> = ({ size }) => {
  const router = useRouter();
  const { createQuery, getQuery } = useQueryString();

  const onSubmitForm = async (value: any) => {
    const query = createQuery([
      {
        name: FIELDS.keyword,
        value: value[FIELDS.keyword],
      },
      {
        name: FIELDS.location,
        value: value[FIELDS.location],
      },
    ]);

    router.push(`${routes.search}?${query}`, { scroll: false });
  };

  return (
    <FinalForm
      initialValues={getQuery([FIELDS.keyword, FIELDS.location])}
      onSubmit={onSubmitForm}
      render={({ handleSubmit, values, errors, submitting }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Stack
              flexDirection={{ md: "row" }}
              justifyContent="center"
              alignItems="center"
              gap={{ xs: 1, md: 0 }}
            >
              <TextField
                fullWidth
                placeholder="Location"
                name={FIELDS.location}
                size={size === "small" ? "small" : "medium"}
                sx={{
                  borderColor: "transparent",
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <LocationOnSharpIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                name={FIELDS.keyword}
                placeholder="Keyword"
                size={size === "small" ? "small" : "medium"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment sx={{ borderRadius: 0 }} position="end">
                      <SearchSharpIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                sx={{
                  py: size === "small" ? 1.22 : 2.22,
                  width: { xs: "100%", md: "auto" },
                }}
                variant="contained"
                color="inherit"
                size="large"
              >
                SEARCH
              </Button>
            </Stack>
          </form>
        );
      }}
    />
  );
};

export default SearchFilterForm;

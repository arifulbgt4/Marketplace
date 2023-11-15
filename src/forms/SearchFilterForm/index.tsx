"use client";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { Form as FinalForm } from "react-final-form";
import { InputAdornment, Stack, Box } from "@mui/material";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import LocationOnSharpIcon from "@mui/icons-material/LocationOnSharp";
import IconButton from "@mui/material/IconButton";

import { TextField } from "src/components/Input";
import { useQueryString } from "src/global/hooks";
import routes from "src/global/routes";

import { FIELDS, SearchFilterFormProps } from "./Types";

const SearchFilterForm: FC<SearchFilterFormProps> = ({}) => {
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
                name={FIELDS.keyword}
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
                name={FIELDS.location}
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
                  type="submit"
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

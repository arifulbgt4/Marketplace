"use client";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { Form as FinalForm } from "react-final-form";
import { InputAdornment, Stack, Button } from "@mui/material";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import LocationOnSharpIcon from "@mui/icons-material/LocationOnSharp";

import { TextField } from "src/components/Input";
import { useQueryString } from "src/global/hooks";
import routes from "src/global/routes";

import SearchLocation from "./SearchLocation";
import { FIELDS, SearchFilterFormProps } from "./Types";

const SearchFilterForm: FC<SearchFilterFormProps> = ({ size, onClose }) => {
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
    onClose && onClose();
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
                label="Keyword"
                name={FIELDS.keyword}
                size={size === "small" ? "small" : "medium"}
              />
              <SearchLocation size={size} />

              <Button
                sx={{
                  py: size === "small" ? 1.22 : 2.22,
                  width: { xs: "100%", md: "auto" },
                }}
                variant="contained"
                type="submit"
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

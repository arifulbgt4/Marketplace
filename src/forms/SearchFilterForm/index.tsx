"use client";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { Form as FinalForm } from "react-final-form";
import { Paper, Typography, Grid, Stack, IconButton, Box } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import LocationOnSharpIcon from "@mui/icons-material/LocationOnSharp";

// import { TextField } from "src/components/Input";
import { useQueryString } from "src/global/hooks";
import routes from "src/global/routes";

import SearchLocation from "./SearchLocation";
import { FIELDS, SearchFilterFormProps } from "./Types";
import SearchKeyword from "../SearchKeyword";

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
    <Stack component={Paper} borderRadius={25}>
      <FinalForm
        initialValues={getQuery([FIELDS.keyword, FIELDS.location])}
        onSubmit={onSubmitForm}
        render={({ handleSubmit, values, errors, submitting }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Grid
                container
                component={Stack}
                justifyContent="center"
                alignItems="center"
                spacing={0.5}
              >
                <Grid item xs={4}>
                  <Box
                    sx={(theme) => ({
                      "&:hover": {
                        bgcolor: theme.palette.action.hover,
                        borderRadius: 25,
                        boxShadow: "0px 3px 6px #00000029",
                      },
                    })}
                  >
                    <SearchLocation size={size} />
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box
                    sx={(theme) => ({
                      "&:hover": {
                        bgcolor: theme.palette.action.hover,
                        borderRadius: 25,
                        boxShadow: "0px 3px 6px #00000029",
                      },
                    })}
                  >
                    <SearchKeyword size={size} />
                  </Box>
                  {/* <TextField
                    defaultValue="Hello World"
                    required
                    id="outlined-required"
                    variant="filled"
                    label="Keyword"
                    name={FIELDS.keyword}
                    size={size === "small" ? "small" : "medium"}
                  /> */}
                </Grid>

                <Grid
                  item
                  xs={4}
                  component={Stack}
                  position="relative"
                  height={72}
                  justifyContent="center"
                  alignItems="center"
                  sx={(theme) => ({
                    "&:hover": {
                      bgcolor: theme.palette.action.hover,
                      borderRadius: 25,
                      boxShadow: "0px 3px 6px #00000029",
                    },
                  })}
                >
                  <Typography>date</Typography>
                </Grid>
                <Box position="relative">
                  <IconButton
                    type="submit"
                    size="large"
                    sx={(theme) => ({
                      position: "absolute",
                      right: 0,
                      top: -33,
                      border: 10,
                      borderColor: "background.paper",

                      bgcolor: theme.palette.info.main,
                      "&:hover": {
                        bgcolor: theme.palette.info.dark,
                      },
                    })}
                  >
                    <SearchSharpIcon
                      sx={(theme) => ({
                        transform: "rotate(90deg)",
                        height: 27,
                        width: 27,
                        color: theme.palette.info.contrastText,
                      })}
                    />
                  </IconButton>
                </Box>
              </Grid>
            </form>
          );
        }}
      />
    </Stack>
  );
};

export default SearchFilterForm;

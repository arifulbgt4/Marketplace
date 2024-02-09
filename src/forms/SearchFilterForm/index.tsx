"use client";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { Form as FinalForm } from "react-final-form";
import {
  Typography,
  Grid,
  Stack,
  IconButton,
  Box,
  Hidden,
} from "@mui/material";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";

import { useQueryString } from "src/global/hooks";
import routes from "src/global/routes";

import SearchLocation from "./SearchLocation";
import SearchKeyword from "../SearchKeyword";

import { FIELDS, SearchFilterFormProps } from "./Types";

const SearchFilterForm: FC<SearchFilterFormProps> = ({ size, onClose }) => {
  const [dateSelect, setDateSelect] = useState("");
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
    <Stack
      bgcolor={{ md: "background.paper" }}
      boxShadow={{ xs: 0, md: 10 }}
      borderRadius={{ md: 25 }}
      justifyContent="center"
    >
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
                columnSpacing={0.5}
                rowSpacing={2}
              >
                <Grid item xs={12} md={4}>
                  <Stack
                    sx={(theme) => ({
                      background: {
                        xs: theme.palette.background.default,
                        md: "transparent",
                      },
                      borderRadius: { xs: 50, md: "none" },
                      boxShadow: { xs: 10, md: 0 },
                    })}
                  >
                    <SearchLocation size={size} />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack
                    sx={(theme) => ({
                      background: {
                        xs: theme.palette.background.default,
                        md: "transparent",
                      },
                      borderRadius: { xs: 50, md: "none" },
                      boxShadow: { xs: 10, md: 0 },
                    })}
                  >
                    <SearchKeyword size={size} />
                  </Stack>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box
                    component={Stack}
                    position="relative"
                    height={{ xs: 50, md: 72 }}
                    justifyContent="center"
                    sx={(theme) => ({
                      background: {
                        xs: theme.palette.background.default,
                        md: "transparent",
                      },
                      cursor: "pointer",
                      borderRadius: { xs: 50, md: "none" },
                      boxShadow: { xs: 10, md: 0 },
                      "&:hover": {
                        bgcolor: theme.palette.action.hover,
                        borderRadius: 25,
                        boxShadow: "0px 3px 6px #00000029",
                      },
                    })}
                  >
                    <Typography
                      fontWeight={500}
                      fontSize={dateSelect !== "" ? 13.408 : 18}
                      color="text.secondary"
                      variant={dateSelect === "" ? "body1" : "caption"}
                      pl={2}
                    >
                      When?
                    </Typography>
                    {dateSelect !== "" && (
                      <Typography
                        fontWeight={300}
                        color="text.secondary"
                        pl={2}
                        sx={{ opacity: 0.6 }}
                      >
                        {dateSelect}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Hidden mdDown>
                  <Box position="relative">
                    <IconButton
                      type="submit"
                      size="large"
                      sx={(theme) => ({
                        position: "absolute",
                        right: 0,
                        top: -29,
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
                </Hidden>
                <Hidden mdUp>
                  <Grid item xs={12}>
                    <Box
                      sx={(theme) => ({
                        bgcolor: theme.palette.primary.main,
                        borderRadius: 25,
                      })}
                      component={Stack}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <IconButton type="submit" size="large">
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
                </Hidden>
              </Grid>
            </form>
          );
        }}
      />
    </Stack>
  );
};

export default SearchFilterForm;

"use client";
import { FC } from "react";
import { Field, Form as FinalForm } from "react-final-form";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Grid,
  Stack,
  IconButton,
  Box,
  Hidden,
  MenuItem,
  TextField,
} from "@mui/material";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";

import { useQueryString } from "src/global/hooks";

import { FIELDS, SearchFilterFormProps } from "./Types";
import {
  buildProductSearchUrl,
  normalizeProductSort,
  type ProductSearchFormValues,
} from "./product-search";

const SearchFilterForm: FC<SearchFilterFormProps> = ({ size, onClose }) => {
  const router = useRouter();
  const text = useTranslations("Catalog");
  const { getQuery } = useQueryString();
  const initialQuery = getQuery([FIELDS.query, FIELDS.minPrice, FIELDS.sort]);

  const onSubmitForm = (values: ProductSearchFormValues) => {
    router.push(buildProductSearchUrl(values), { scroll: false });
    onClose?.();
  };

  return (
    <Stack
      bgcolor={{ md: "background.paper" }}
      boxShadow={{ xs: 0, md: 10 }}
      borderRadius={{ md: 25 }}
      justifyContent="center"
    >
      <FinalForm<ProductSearchFormValues>
        initialValues={{
          query: "",
          minPrice: "",
          ...initialQuery,
          sort: normalizeProductSort(initialQuery[FIELDS.sort]),
        }}
        onSubmit={onSubmitForm}
        render={({ handleSubmit }) => {
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
                    <Field<string> name={FIELDS.query}>
                      {({ input }) => (
                        <TextField
                          {...input}
                          label={text("searchProducts")}
                          fullWidth
                          size={size ?? "small"}
                          variant="filled"
                          inputProps={{ maxLength: 100 }}
                          sx={{
                            pl: { xs: 1, md: 2 },
                            "& label": {
                              pt: { md: 1.4 },
                              fontWeight: 500,
                            },
                          }}
                        />
                      )}
                    </Field>
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
                    <Field<string> name={FIELDS.minPrice}>
                      {({ input }) => (
                        <TextField
                          {...input}
                          label={text("minimumPrice")}
                          type="number"
                          fullWidth
                          size={size ?? "small"}
                          variant="filled"
                          inputProps={{
                            min: 0,
                            max: 999999.99,
                            step: "0.01",
                            inputMode: "decimal",
                          }}
                          sx={{
                            pl: { xs: 1, md: 2 },
                            "& label": {
                              pt: { md: 1.4 },
                              fontWeight: 500,
                            },
                          }}
                        />
                      )}
                    </Field>
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
                    <Field<string> name={FIELDS.sort}>
                      {({ input }) => (
                        <TextField
                          {...input}
                          select
                          label={text("sort")}
                          fullWidth
                          size={size ?? "small"}
                          variant="filled"
                          sx={{
                            px: { xs: 1, md: 2 },
                            "& label": {
                              pt: { md: 1.4 },
                              pl: { xs: 1, md: 2 },
                              fontWeight: 500,
                            },
                          }}
                        >
                          <MenuItem value="newest">{text("newest")}</MenuItem>
                          <MenuItem value="oldest">{text("oldest")}</MenuItem>
                          <MenuItem value="name_asc">
                            {text("nameAscending")}
                          </MenuItem>
                          <MenuItem value="name_desc">
                            {text("nameDescending")}
                          </MenuItem>
                          <MenuItem value="price_asc">
                            {text("priceAscending")}
                          </MenuItem>
                          <MenuItem value="price_desc">
                            {text("priceDescending")}
                          </MenuItem>
                        </TextField>
                      )}
                    </Field>
                  </Box>
                </Grid>
                <Hidden mdDown implementation="css">
                  <Box position="relative">
                    <IconButton
                      type="submit"
                      size="large"
                      aria-label={text("searchProducts")}
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
                <Hidden mdUp implementation="css">
                  <Grid
                    item
                    xs={12}
                    sx={(theme) => ({
                      bgcolor: theme.palette.primary.main,
                      borderRadius: 25,
                    })}
                    component={Stack}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <IconButton
                      type="submit"
                      size="large"
                      aria-label={text("searchProducts")}
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

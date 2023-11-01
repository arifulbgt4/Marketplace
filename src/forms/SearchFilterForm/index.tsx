"use client";
import { FC, useState } from "react";
import {
  Paper,
  Box,
  FormControl,
  Hidden,
  Button,
  Grid,
  Drawer,
  InputLabel,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import LocationOnSharpIcon from "@mui/icons-material/LocationOnSharp";
import IconButton from "@mui/material/IconButton";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import { Form as FinalForm } from "react-final-form";

import { SearchFilterFormProps } from "./Types";
import ListSearchFilters from "src/widgets/ListSearchFilters";

const SearchFilterForm: FC<SearchFilterFormProps> = ({}) => {
  const [open, setOpen] = useState(false);
  const onSubmitForm = async () => {};

  return (
    <Paper sx={{ pb: { md: 1 } }}>
      <FinalForm
        onSubmit={onSubmitForm}
        render={({ handleSubmit, values, errors, submitting }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Grid container>
                <Hidden mdUp>
                  <Grid
                    item
                    xs={1}
                    md={0}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <IconButton
                      onClick={() => setOpen(true)}
                      sx={(theme) => ({
                        border: `1px solid ${theme.palette.grey[700]}`,
                        borderRadius: 0.5,
                        width: "100%",
                        p: 0,
                        py: 1.4,
                      })}
                    >
                      <FilterAltIcon sx={{ height: 30, width: 30 }} />
                    </IconButton>
                  </Grid>
                  <Drawer open={open} onClose={() => setOpen(false)}>
                    <Box width={{ xs: 250, sm: 300 }}>
                      <ListSearchFilters
                        onCloseMobileDrawer={() => setOpen(false)}
                      />
                    </Box>
                  </Drawer>
                </Hidden>

                <Grid item xs={5}>
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
                <Grid item xs={5}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-listing">
                      Key
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      endAdornment={
                        <InputAdornment position="start">
                          <IconButton>
                            <SearchSharpIcon />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid xs={1} md={2}>
                  <Hidden mdDown>
                    <Button fullWidth variant="contained" sx={{ py: 2 }}>
                      Search
                    </Button>
                  </Hidden>
                  <Hidden mdUp>
                    <IconButton
                      sx={(theme) => ({
                        bgcolor: theme.palette.primary.dark,
                        borderRadius: 0.5,
                        width: "100%",
                        py: 2,
                      })}
                    >
                      <SearchSharpIcon />
                    </IconButton>
                  </Hidden>
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

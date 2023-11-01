import { FC } from "react";
import { Form as FinalForm } from "react-final-form";
import {
  Paper,
  FormControl,
  Hidden,
  Button,
  Grid,
  InputLabel,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import LocationOnSharpIcon from "@mui/icons-material/LocationOnSharp";
import IconButton from "@mui/material/IconButton";

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
                <Grid item xs={5.5} md={5}>
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
                <Grid item xs={5.5} md={5}>
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

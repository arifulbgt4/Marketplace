import { FC } from "react";
import { Form as FinalForm } from "react-final-form";
import {
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  Input,
  MenuItem,
  InputAdornment,
} from "@mui/material";

import { TextField } from "src/components/Input";

import { Step4Props } from "./Types";

const Step4: FC<Step4Props> = () => {
  const onSubmitForm = async () => {};
  return (
    <FinalForm
      onSubmit={onSubmitForm}
      render={({ handleSubmit, values, errors, submitting }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <FormControl sx={{ m: 1 }} variant="standard" fullWidth>
                  <InputLabel htmlFor="demo-customized-textbox">
                    About Property
                  </InputLabel>
                  <Select
                    fullWidth
                    name="aboutproperty"
                    label="Property Details"
                    multiline
                    input={<Input />}
                  >
                    <MenuItem>item1</MenuItem>
                    <MenuItem>item1</MenuItem>
                    <MenuItem>item1</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} container spacing={5}>
                <Grid item xs={4}>
                  <FormControl sx={{ m: 1 }} variant="standard" fullWidth>
                    <InputLabel htmlFor="demo-customized-textbox">
                      Bedroom
                    </InputLabel>
                    <Select
                      variant="outlined"
                      fullWidth
                      name="bedroom"
                      input={<Input />}
                      label="Bedroom"
                    >
                      <MenuItem>item1</MenuItem>
                      <MenuItem>item1</MenuItem>
                      <MenuItem>item1</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl sx={{ m: 1 }} variant="standard" fullWidth>
                    <InputLabel htmlFor="demo-customized-textbox">
                      Bathroom
                    </InputLabel>
                    <Select
                      fullWidth
                      name="bathroom"
                      input={<Input />}
                      label="Bathroom"
                    >
                      <MenuItem>item1</MenuItem>
                      <MenuItem>item1</MenuItem>
                      <MenuItem>item1</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    sx={{ m: 1 }}
                    name="size"
                    label="Size"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography>squre feet</Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12} container spacing={5}>
                <Grid item xs={4}>
                  <FormControl sx={{ m: 1 }} variant="standard" fullWidth>
                    <InputLabel htmlFor="demo-customized-textbox">
                      Smoking
                    </InputLabel>
                    <Select
                      fullWidth
                      name="smoking"
                      input={<Input />}
                      label="smoking"
                    >
                      <MenuItem>item1</MenuItem>
                      <MenuItem>item1</MenuItem>
                      <MenuItem>item1</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl sx={{ m: 1 }} variant="standard" fullWidth>
                    <InputLabel htmlFor="demo-customized-textbox">
                      Pet
                    </InputLabel>
                    <Select fullWidth name="pet" input={<Input />} label="Pet">
                      <MenuItem>item1</MenuItem>
                      <MenuItem>item1</MenuItem>
                      <MenuItem>item1</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl sx={{ m: 1 }} variant="standard" fullWidth>
                    <InputLabel htmlFor="demo-customized-textbox">
                      Parking
                    </InputLabel>
                    <Select
                      fullWidth
                      name="parking"
                      input={<Input />}
                      label="Parking"
                    >
                      <MenuItem>item1</MenuItem>
                      <MenuItem>item1</MenuItem>
                      <MenuItem>item1</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </form>
        );
      }}
    />
  );
};

export default Step4;

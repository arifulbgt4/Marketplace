import { FC } from "react";
import {
  Grid,
  Box,
  Typography,
  TextField,
  FormControl,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

import { ItemsProps, UserSettingFormProps } from "./Types";

const UserSettingForm: FC<UserSettingFormProps> = () => {
  return (
    <Box p={5} boxShadow={3}>
      <Grid container rowSpacing={5}>
        <Items property="First Name">
          <TextField
            fullWidth
            id="full-width"
            label="First Name"
            variant="outlined"
          />
        </Items>
        <Items property="Last Name">
          <TextField
            fullWidth
            id="full-width"
            label="Last Name"
            variant="outlined"
          />
        </Items>
        <Items property="Email Adress">
          <TextField
            fullWidth
            id="full-width"
            label="Email"
            variant="outlined"
          />
        </Items>
        <Items property="Your Numbers">
          <TextField
            fullWidth
            id="full-width"
            label="Your Numbers"
            variant="outlined"
          />
        </Items>
        <Items property="Adress">
          <TextField
            fullWidth
            id="full-width"
            label="Adress"
            variant="outlined"
          />
        </Items>
        <Items property="Country">
          <TextField
            fullWidth
            id="full-width"
            label="Country"
            variant="outlined"
          />
        </Items>
        <Items property="Profile Text">
          <TextField
            fullWidth
            multiline
            rows={4}
            id="full-width"
            label="Profile Text"
            variant="outlined"
          />
        </Items>
        <Items property="Gender">
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
            >
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
          </FormControl>
        </Items>
        <Items property="">
          <Button variant="outlined">Save or Update</Button>
        </Items>
      </Grid>
    </Box>
  );
};

export default UserSettingForm;
const Items: FC<ItemsProps> = ({ property, children }) => {
  return (
    <>
      <Grid item xs={3}>
        <Typography variant="h6">{property}</Typography>
      </Grid>
      <Grid item xs={8}>
        {children}
      </Grid>
    </>
  );
};

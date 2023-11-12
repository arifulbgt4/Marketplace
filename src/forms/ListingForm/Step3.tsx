import { FC } from "react";
import {
  Grid,
  Typography,
  Stack,
  Box,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { TextField } from "src/components/Input";

import { Step3Props } from "./Types";

const Step3: FC<Step3Props> = () => {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12}>
        <Typography variant="h6" textAlign="center">
          Contact Method
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" flexWrap="wrap" justifyContent="space-between">
          <Box>
            <FormControlLabel
              value="end"
              control={<Checkbox name="phone" />}
              label="Phone"
              labelPlacement="end"
            />
          </Box>
          <Box>
            <FormControlLabel
              value="end"
              control={<Checkbox name="email" />}
              label="Email"
              labelPlacement="end"
            />
          </Box>
          <Box>
            <FormControlLabel
              value="end"
              control={<Checkbox name="text" />}
              label="Text"
              labelPlacement="end"
            />
          </Box>
        </Stack>
      </Grid>
      <Grid
        item
        xs={12}
        container
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid item xs={6}>
          <TextField fullWidth name="phonenumber" label="Phone Number" />
        </Grid>
        <Grid item xs={3}>
          <Button startIcon={<AddIcon />} size="medium">
            Add Another
          </Button>
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        container
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid item xs={6}>
          <TextField fullWidth name="emailaddress" label="Email Address" />
        </Grid>
        <Grid item xs={3}>
          <Button startIcon={<AddIcon />} size="medium">
            Add Another
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Step3;

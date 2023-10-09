"use client";
import { FC, useState } from "react";
import {
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Box,
  Stack,
  Button,
  Typography,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { BannerCreateListingProps } from "./Types";

const BannerCreateListing: FC<BannerCreateListingProps> = () => {
  const [label, setLabel] = useState("");
  const handleChange = (event: SelectChangeEvent) => {
    setLabel(event.target.value as string);
  };

  return (
    <Paper>
      <Box>
        <Typography variant="h5">Select a category for your upload:</Typography>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-filled-label">Label</InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={label}
            onChange={handleChange}
          >
            <MenuItem value="label">
              <em>None</em>
            </MenuItem>
            <MenuItem value={1}>One</MenuItem>
            <MenuItem value={2}>Two</MenuItem>
            <MenuItem value={3}>Three</MenuItem>
          </Select>
        </FormControl>
        <Stack direction="row" justifyContent="space-between">
          <Button>UPLOAD</Button>
          <Button>READ INSTRUCTIONS</Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default BannerCreateListing;

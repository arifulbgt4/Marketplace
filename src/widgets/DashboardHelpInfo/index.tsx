"use client";
import { FC, useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Stack,
  Button,
  Typography,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import Info from "src/components/Info";

import { DashboardHelpInfoProps } from "./Types";

const DashboardHelpInfo: FC<DashboardHelpInfoProps> = () => {
  const [label, setLabel] = useState("");
  const handleChange = (event: SelectChangeEvent) => {
    setLabel(event.target.value as string);
  };
  return (
    <Info title="Begin Upload">
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
    </Info>
  );
};

export default DashboardHelpInfo;

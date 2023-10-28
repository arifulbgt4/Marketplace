import { FC } from "react";
import { Button, ButtonGroup } from "@mui/material";
import AlarmIcon from "@mui/icons-material/Alarm";

import { FilterButtonGroupProps } from "./Types";

const FitlerButtonGroup: FC<FilterButtonGroupProps> = () => {
  return (
    <ButtonGroup
      variant="contained"
      fullWidth
      aria-label="outlined primary button group"
    >
      <Button startIcon={<AlarmIcon />}>Grid</Button>
      <Button startIcon={<AlarmIcon />}>List</Button>
      <Button startIcon={<AlarmIcon />}>Map</Button>
    </ButtonGroup>
  );
};

export default FitlerButtonGroup;

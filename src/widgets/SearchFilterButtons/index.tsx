import { FC } from "react";
import { IconButton, Stack, Button } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CheckIcon from "@mui/icons-material/Check";

import { SearchFilterButtonsProps } from "./Types";

const SearchFilterButtons: FC<SearchFilterButtonsProps> = () => {
  return (
    <Stack direction="row" justifyContent="space-between">
      <IconButton>
        <FilterAltIcon />
        Filter
      </IconButton>
      <Stack direction="row" gap={1}>
        <Button startIcon={<RestartAltIcon />}>Reset</Button>
        <Button startIcon={<CheckIcon />} variant="contained">
          Result
        </Button>
      </Stack>
    </Stack>
  );
};

export default SearchFilterButtons;

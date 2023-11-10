import { FC } from "react";
import { IconButton, Stack, Button } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CheckIcon from "@mui/icons-material/Check";

import { SearchFilterButtonsProps } from "./Types";

const SearchFilterButtons: FC<SearchFilterButtonsProps> = ({
  onCloseMobileDrawer,
}) => {
  return (
    <Stack flexDirection="column" pb={2}>
      <IconButton
        size="small"
        sx={{
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <FilterAltIcon />
        Filter
      </IconButton>
      <Stack direction="row" gap={1} justifyContent="space-between">
        <Button
          size="small"
          startIcon={<RestartAltIcon />}
          onClick={onCloseMobileDrawer}
        >
          Reset
        </Button>

        <Button
          size="small"
          startIcon={<CheckIcon />}
          onClick={onCloseMobileDrawer}
          variant="contained"
        >
          Result
        </Button>
      </Stack>
    </Stack>
  );
};

export default SearchFilterButtons;

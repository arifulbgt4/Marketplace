import { FC } from "react";
import { Button, ButtonGroup } from "@mui/material";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";
import MenuIcon from "@mui/icons-material/Menu";
import LanguageIcon from "@mui/icons-material/Language";

import { ListGridViewProps } from "./Types";

const ListGridView: FC<ListGridViewProps> = ({ toggleGridList, isGrid }) => {
  return (
    <ButtonGroup
      variant="contained"
      fullWidth
      aria-label="outlined primary button group"
    >
      <Button
        sx={(theme) => ({
          bgcolor: isGrid
            ? theme.palette.primary.dark
            : theme.palette.error.contrastText,
        })}
        startIcon={<AutoAwesomeMosaicIcon />}
        onClick={() => {
          toggleGridList(true);
        }}
      >
        Grid
      </Button>
      <Button
        sx={(theme) => ({
          bgcolor: !isGrid
            ? theme.palette.primary.dark
            : theme.palette.error.contrastText,
        })}
        startIcon={<MenuIcon />}
        onClick={() => {
          toggleGridList(false);
        }}
      >
        List
      </Button>
      <Button
        startIcon={<LanguageIcon />}
        sx={(theme) => ({ bgcolor: theme.palette.error.contrastText })}
      >
        Map
      </Button>
    </ButtonGroup>
  );
};

export default ListGridView;

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
          color: isGrid
            ? theme.palette.common.white
            : theme.palette.common.black,
          bgcolor: isGrid
            ? theme.palette.primary.dark
            : theme.palette.error.contrastText,
          ":hover": {
            bgcolor: !isGrid && "Background",
          },
        })}
        disableRipple
        startIcon={<AutoAwesomeMosaicIcon />}
        onClick={() => {
          toggleGridList(true);
        }}
      >
        Grid
      </Button>
      <Button
        sx={(theme) => ({
          color: !isGrid
            ? theme.palette.common.white
            : theme.palette.common.black,
          bgcolor: !isGrid
            ? theme.palette.primary.dark
            : theme.palette.error.contrastText,
          ":hover": {
            bgcolor: isGrid && "Background",
          },
        })}
        disableRipple
        startIcon={<MenuIcon />}
        onClick={() => {
          toggleGridList(false);
        }}
      >
        List
      </Button>
    </ButtonGroup>
  );
};

export default ListGridView;

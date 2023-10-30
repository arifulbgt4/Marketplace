import { FC } from "react";
import { Button, ButtonGroup } from "@mui/material";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";
import MenuIcon from "@mui/icons-material/Menu";
import LanguageIcon from "@mui/icons-material/Language";

import { ListGridViewProps } from "./Types";

const ListGridView: FC<ListGridViewProps> = ({
  handleList,
  handleGrid,
  isGrid,
}) => {
  return (
    <ButtonGroup
      variant="contained"
      fullWidth
      aria-label="outlined primary button group"
    >
      <Button
        sx={(theme) => ({
          bgcolor: isGrid ? theme.palette.primary.dark : "",
        })}
        startIcon={<AutoAwesomeMosaicIcon />}
        onClick={() => {
          handleGrid(true);
        }}
      >
        Grid
      </Button>
      <Button
        sx={(theme) => ({
          bgcolor: !isGrid ? theme.palette.primary.dark : "",
        })}
        startIcon={<MenuIcon />}
        onClick={() => {
          handleList(false);
        }}
      >
        List
      </Button>
      <Button startIcon={<LanguageIcon />}>Map</Button>
    </ButtonGroup>
  );
};

export default ListGridView;

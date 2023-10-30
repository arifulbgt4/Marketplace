import { FC } from "react";
import { Button, ButtonGroup } from "@mui/material";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";
import MenuIcon from "@mui/icons-material/Menu";
import LanguageIcon from "@mui/icons-material/Language";

import { ListGridViewProps } from "./Types";

const ListGridView: FC<ListGridViewProps> = () => {
  return (
    <ButtonGroup
      variant="contained"
      fullWidth
      aria-label="outlined primary button group"
    >
      <Button startIcon={<AutoAwesomeMosaicIcon />}>Grid</Button>
      <Button startIcon={<MenuIcon />}>List</Button>
      <Button startIcon={<LanguageIcon />}>Map</Button>
    </ButtonGroup>
  );
};

export default ListGridView;

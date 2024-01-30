import { FC, useState } from "react";
import {
  Box,
  CardMedia,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";

import { CounttryLanRegionProps } from "./Types";

const CounttryLanRegion: FC<CounttryLanRegionProps> = ({
  indexCoun,
  name,
  flag,
  currenciesSymbole,
  currenciesName,
  language,
  currencie,
  isActive = false,
  onClick,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(1);

  const handleListItemClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
        cursor: "pointer",
      }}
    >
      <List component="nav" aria-label="main mailbox folders">
        <ListItem selected={isActive} onClick={onClick && onClick}>
          <Stack flexDirection="row" alignItems="center" width="100%" gap={1}>
            <Box borderColor="action.focus" borderRadius={1} width={70}>
              <Typography variant="h1">{flag}</Typography>
            </Box>
            <Box width={115}>
              <Typography variant="h6">
                {language && language}
                {currenciesName && currenciesName}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {name && name.slice(0, 9)}
                {currencie}
              </Typography>
            </Box>
          </Stack>
        </ListItem>
      </List>
    </Box>
  );
};

export default CounttryLanRegion;

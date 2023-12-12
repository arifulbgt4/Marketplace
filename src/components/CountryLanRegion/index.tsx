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
}: any) => {
  const [selectedIndex, setSelectedIndex] = useState(1);

  const handleListItemClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <List component="nav" aria-label="main mailbox folders">
        <ListItem
          selected={selectedIndex === indexCoun ? true : false}
          onClick={() => {
            handleListItemClick(indexCoun);
          }}
        >
          <Stack flexDirection="row" alignItems="center" width="100%" gap={1}>
            <Box
              p={{ lg: 1.25, md: 1.25, sm: 1.25 }}
              border={{ lg: 1, md: 1, sm: 0.5 }}
              borderColor="action.focus"
              borderRadius={1}
              width={70}
            >
              <CardMedia component="img" height={24} image={flag} />
            </Box>
            <Box width={115}>
              <Typography variant="h6">
                {language && language}
                {currenciesName && currenciesName.slice(0, 9)}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {name && name.slice(0, 9)}
                {currencie} {currenciesSymbole && <>-{currenciesSymbole}</>}
              </Typography>
            </Box>
          </Stack>
        </ListItem>
      </List>
    </Box>
  );
};

export default CounttryLanRegion;

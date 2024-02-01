import { FC } from "react";
import { Box, List, ListItem, Stack, Typography } from "@mui/material";

import { LanguageProps } from "./Types";

const Language: FC<LanguageProps> = ({
  name,
  langKey,
  eng,
  isActive = false,
  onClick,
}) => {
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
            <Typography variant="h4" textTransform="uppercase" px={1}>
              {langKey}
            </Typography>
            <Box width={115}>
              <Typography variant="h6">{name}</Typography>
              <Typography color="text.secondary" variant="body2">
                {eng}
              </Typography>
            </Box>
          </Stack>
        </ListItem>
      </List>
    </Box>
  );
};

export default Language;

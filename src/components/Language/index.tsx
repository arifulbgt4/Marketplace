import { FC } from "react";
import {
  Box,
  List,
  ListItemButton,
  Stack,
  Typography,
  alpha,
} from "@mui/material";

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
      <List sx={{ p: 0 }} component="nav" aria-label="main mailbox folders">
        <ListItemButton
          selected={isActive}
          sx={(theme) => ({
            borderRadius: 2,

            border: 0.2,
            borderColor: isActive ? theme.palette.action.focus : "transparent",
            px: 1,
            bgcolor: alpha(
              theme.palette.primary.light,
              theme.palette.action.selectedOpacity
            ),

            ":hover": {
              bgcolor: alpha(
                theme.palette.primary.dark,
                theme.palette.action.focusOpacity
              ),
            },
          })}
          onClick={onClick && onClick}
        >
          <Stack flexDirection="row" alignItems="center" width="100%" gap={1}>
            <Typography fontWeight={600} variant="h4" textTransform="uppercase">
              {langKey}
            </Typography>
            <Box width={115}>
              <Typography variant="h6" fontWeight={500}>
                {name?.slice(0, 10)}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {eng}
              </Typography>
            </Box>
          </Stack>
        </ListItemButton>
      </List>
    </Box>
  );
};

export default Language;

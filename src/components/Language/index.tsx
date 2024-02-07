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
            // boxShadow: 10,
            bgcolor: alpha(
              theme.palette.primary.dark,
              theme.palette.action.focusOpacity
            ),

            ":hover": {
              // boxShadow: 14,
              bgcolor: alpha(
                theme.palette.primary.light,
                theme.palette.action.selectedOpacity
              ),
            },
          })}
          onClick={onClick && onClick}
        >
          <Stack flexDirection="row" alignItems="center" width="100%" gap={1}>
            <Typography
              fontWeight={600}
              variant="h4"
              textTransform="uppercase"
              px={1}
            >
              {langKey}
            </Typography>
            <Box width={115}>
              <Typography variant="h6" fontWeight={500}>
                {name}
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

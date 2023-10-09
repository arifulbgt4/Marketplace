import { FC } from "react";
import {
  TextField,
  Stack,
  Box,
  Avatar,
  Typography,
  Button,
} from "@mui/material";

import Info from "src/components/Info";

import { ListingHelpInfoProps } from "./Types";

const ListingHelpInfo: FC<ListingHelpInfoProps> = () => {
  return (
    <>
      <Box mb={3}>
        <Info title="Search Properties">
          <Box component="form" noValidate autoComplete="off">
            <TextField label="Search" variant="outlined" />
          </Box>
        </Info>
      </Box>

      <Info>
        <Stack direction="row">
          <Avatar>pp</Avatar>
          <Typography variant="h4">6 Properties Listed</Typography>
        </Stack>
        <Stack direction="column" px={8}>
          <Button>CURRENTLY AVIAILABLE</Button>
          <Button>create new properties</Button>
        </Stack>
      </Info>
    </>
  );
};

export default ListingHelpInfo;

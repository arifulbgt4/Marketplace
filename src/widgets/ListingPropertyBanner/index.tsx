import { FC } from "react";
import { Paper, Stack, Box, Avatar, Typography, Button } from "@mui/material";

import { ListingPropertyBanner } from "./Types";

const ListingPropertyBanner: FC<ListingPropertyBanner> = () => {
  return (
    <Paper>
      <Stack direction="row">
        <Avatar>pp</Avatar>
        <Typography variant="h4">6 Properties Listed</Typography>
      </Stack>
      <Stack direction="column" px={8}>
        <Button>CURRENTLY AVIAILABLE</Button>
        <Button>create new properties</Button>
      </Stack>
    </Paper>
  );
};

export default ListingPropertyBanner;

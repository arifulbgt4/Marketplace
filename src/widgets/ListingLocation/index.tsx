"use client";
import { FC } from "react";
import { Box, Stack, Typography } from "@mui/material";

import { ListingLocationProps } from "./Types";
import Mapbox from "src/components/Mapbox";

const ListingLocation: FC<ListingLocationProps> = ({ address }) => {
  return (
    <Stack gap={3}>
      <Box>
        <Typography variant="body2">Where you’ll be</Typography>
        <Typography variant="body2">{address}</Typography>
      </Box>
      <Typography variant="h5">Map</Typography>
      <Box height={400} boxShadow={1} borderRadius={2} overflow="hidden">
        <Mapbox />
      </Box>
    </Stack>
  );
};

export default ListingLocation;

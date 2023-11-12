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

import { OwnListingMapProps } from "./Types";

const OwnListingMap: FC<OwnListingMapProps> = () => {
  return (
    <>
      <Box mb={3}>
        <Info title="Location Map">
          <Typography>Map</Typography>
        </Info>
      </Box>
    </>
  );
};

export default OwnListingMap;

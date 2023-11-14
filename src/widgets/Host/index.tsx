import { FC } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Avatar,
  Stack,
  Typography,
  Rating,
  Box,
  Paper,
  Link,
} from "@mui/material";

import routes from "src/global/routes";

import { HostProps } from "./Types";

const Host: FC<HostProps> = ({ src, rating, review, name }) => {
  return (
    <Paper sx={{ borderRadius: 2, p: 2 }} elevation={0}>
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        component={Link}
        href={`${routes.profile}/profile`}
      >
        <Stack flexDirection="row" gap={1} alignItems="center">
          <Avatar src={src} alt="hostP" />
          <Box>
            <Typography color="text.primary">{name}</Typography>
            <Stack flexDirection="row" gap={0.5}>
              <Rating defaultValue={1} max={1} size="small" />
              <Typography variant="subtitle2" color="text.secondary">
                {rating}/{review}
              </Typography>
            </Stack>
          </Box>
        </Stack>
        <ArrowForwardIcon />
      </Stack>
    </Paper>
  );
};

export default Host;

//   <CardHeader
//     avatar={<Avatar />}
//     title="John Doue"
//     subheader={
//
//     }
//     action={<ArrowForwardIcon />}
//   />

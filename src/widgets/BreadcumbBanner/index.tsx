import { FC } from "react";
import { Paper, Stack, Typography } from "@mui/material";

import { BreadcumbBannerProps } from "./Types";

const BreadcumbBanner: FC<BreadcumbBannerProps> = ({ title }) => {
  return (
    <Paper elevation={0}>
      <Stack
        justifyContent="center"
        alignItems="center"
        minHeight={{ xs: 98, sm: 120, md: 217 }}
      >
        <Typography variant="h3">{title}</Typography>
      </Stack>
    </Paper>
  );
};

export default BreadcumbBanner;

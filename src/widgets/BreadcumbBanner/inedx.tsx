import { FC } from "react";
import { Paper, Typography } from "@mui/material";

import { BreadcumbBannerProps } from "./Types";

const BreadcumbBanner: FC<BreadcumbBannerProps> = () => {
  return (
    <Paper>
      <Typography variant="h3">BreadcumbBanner</Typography>
    </Paper>
  );
};

export default BreadcumbBanner;

import { FC } from "react";
import { Paper, Typography } from "@mui/material";

import { ListingDetailsBannerProps } from "./Types";

const ListingDetailsBanner: FC<ListingDetailsBannerProps> = () => {
  return (
    <Paper>
      <Typography>ListingDetailsBanner</Typography>
    </Paper>
  );
};

export default ListingDetailsBanner;

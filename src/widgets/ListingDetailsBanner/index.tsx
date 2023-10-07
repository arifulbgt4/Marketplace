import { FC } from "react";
import { Paper, Typography } from "@mui/material";

import { ListingBookingProps } from "./Types";

const ListingDetailsBanner: FC<ListingBookingProps> = () => {
  return (
    <Paper>
      <Typography>ListingDetailsBanner</Typography>
    </Paper>
  );
};

export default ListingDetailsBanner;

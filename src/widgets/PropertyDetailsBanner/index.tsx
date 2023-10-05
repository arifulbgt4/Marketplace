import { FC } from "react";
import { Paper, Typography } from "@mui/material";

import { PropertyDetailsBannerProps } from "./Types";

const PropertyDetailsBanner: FC<PropertyDetailsBannerProps> = () => {
  return (
    <Paper>
      <Typography>PropertyDetailsBanner</Typography>
    </Paper>
  );
};

export default PropertyDetailsBanner;

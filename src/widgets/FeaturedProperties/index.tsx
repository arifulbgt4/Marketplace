import { FC } from "react";

import { FeaturedPropertiesProps } from "./Types";
import { Grid } from "@mui/material";

const FeaturedProperties: FC<FeaturedPropertiesProps> = () => {
  return (
    <Grid container>
      <Grid item xs={12}>
        FeaturedProperties
      </Grid>
    </Grid>
  );
};

export default FeaturedProperties;

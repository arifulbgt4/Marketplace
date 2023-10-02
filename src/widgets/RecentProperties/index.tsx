import { FC } from "react";

import { RecentPropertiesProps } from "./Types";
import { Grid } from "@mui/material";

const RecentProperties: FC<RecentPropertiesProps> = () => {
  return (
    <Grid container>
      <Grid item xs={12}>
        RecentProperties
      </Grid>
    </Grid>
  );
};

export default RecentProperties;

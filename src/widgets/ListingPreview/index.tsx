import { FC } from "react";
import { Box, Grid, Typography } from "@mui/material";

import { ListingPreviewProps } from "./Types";

const ListingPreview: FC<ListingPreviewProps> = ({ values }) => {
  return (
    <Grid container spacing={3} p={3}>
      <Grid item>
        <Typography>ListingPreview</Typography>
      </Grid>
    </Grid>
  );
};

export default ListingPreview;

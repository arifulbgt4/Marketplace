import { FC } from "react";
import { Box, Grid } from "@mui/material";

import ListingHeader from "src/widgets/ListingHeader";

import { Album } from "../Album";
import { ListingPreviewProps } from "./Types";

const ListingPreview: FC<ListingPreviewProps> = ({ values }) => {
  const { title, address } = values;
  return (
    <Grid container spacing={3} p={3}>
      <Grid item xs={12}>
        <ListingHeader
          title={title || "{Title}"}
          address={address || "{Address}"}
          creator="superhost"
        />
      </Grid>
      <Grid item xs={12}>
        <Album />
      </Grid>
    </Grid>
  );
};

export default ListingPreview;

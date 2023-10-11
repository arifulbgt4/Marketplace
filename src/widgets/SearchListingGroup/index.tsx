import { FC } from "react";
import { Grid } from "@mui/material";

import { SearchListingGroupProps } from "./Types";

const SearchListingGroup: FC<SearchListingGroupProps> = () => {
  return (
    <Grid container>
      <Grid item container xs={12}>
        <Grid item xs={4}>
          Card
        </Grid>
        <Grid item xs={4}>
          Card
        </Grid>
        <Grid item xs={4}>
          Card
        </Grid>
        <Grid item xs={4}>
          Card
        </Grid>
        <Grid item xs={4}>
          Card
        </Grid>
        <Grid item xs={4}>
          Card
        </Grid>
      </Grid>
      <Grid item xs={12}>
        ListingPagination
      </Grid>
    </Grid>
  );
};

export default SearchListingGroup;

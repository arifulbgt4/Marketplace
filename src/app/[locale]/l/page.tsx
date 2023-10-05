import { Grid } from "@mui/material";

import Listings from "src/widgets/Listings";
import ListingsSidebarFilter from "src/widgets/ListingsSidebarFilter";
import SearchFilter from "src/widgets/SearchFilter";

const ListingAll = () => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <SearchFilter />
      </Grid>
      <Grid item xs={12} container>
        <Grid item xs={4}>
          <ListingsSidebarFilter />
        </Grid>
        <Grid item xs={8}>
          <Listings />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ListingAll;

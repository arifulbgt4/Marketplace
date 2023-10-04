import { Grid } from "@mui/material";

import SearchFilter from "src/widgets/SearchFilter";

const ListingAll = () => {
  return (
    <Grid container>
      <Grid item xs={4}>
        searfilteritem
      </Grid>
      <Grid item xs={8}>
        <SearchFilter />
      </Grid>
    </Grid>
  );
};

export default ListingAll;

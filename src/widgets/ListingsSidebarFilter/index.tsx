import { FC, Suspense } from "react";
import { Grid, Typography } from "@mui/material";

import SearchCategoryFilter from "src/widgets/SearchCategoryFilter";
import SearchFilterForm from "src/forms/SearchFilterForm";

import { ListingsSidebarFilterProps } from "./Types";

const ListingsSidebarFilter: FC<ListingsSidebarFilterProps> = () => {
  return (
    <Grid container gap={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Categories</Typography>
        <SearchCategoryFilter />
      </Grid>
      <Grid item xs={12}>
        <Suspense>
          <SearchFilterForm />
        </Suspense>
      </Grid>
    </Grid>
  );
};

export default ListingsSidebarFilter;

import { Grid, Box, Typography, Stack } from "@mui/material";

import Listings from "src/widgets/Listings";
import SearchCategoryFilter from "src/widgets/SearchCategoryFilter";
import SearchFilter from "src/widgets/SearchFilter";
import SearchFilterForm from "src/widgets/SearchFilterForm";

const ListingAll = () => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <SearchFilter />
      </Grid>
      <Grid item xs={12} container>
        <Grid item xs={4}>
          <Stack direction="column" justifyContent="space-evenly">
            <Box>
              <Typography variant="h4">Categories</Typography>
              <SearchCategoryFilter />
            </Box>
            <Box>
              <SearchFilterForm />
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="h4">WE Found 91 Results</Typography>
          <Listings />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ListingAll;

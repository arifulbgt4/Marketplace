import { Box, Container, Grid, Hidden } from "@mui/material";

import ListSearchFilters from "src/widgets/ListSearchFilters";
import SearchListingGroup from "src/widgets/SearchListingGroup";

const SearchPage = () => {
  return (
    <Box>
      <Container>
        <Grid container columnSpacing={10}>
          <Hidden mdDown>
            <Grid item md={3}>
              <ListSearchFilters />
            </Grid>
          </Hidden>
          <Grid item xs={12} md={9}>
            <SearchListingGroup />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SearchPage;

import { Box, Container, Divider, Grid } from "@mui/material";

import ListSearchFilters from "src/widgets/ListSearchFilters";
import SearchListingGroup from "src/widgets/SearchListingGroup";
import FilterCheckbox from "../../../widgets/FilterCheckbox/index";

const SearchPage = () => {
  return (
    <Box>
      <Container>
        <Grid container>
          <Grid item xs={3}>
            <ListSearchFilters />
            <Divider />
            <FilterCheckbox title="property type" />
            <Divider />
          </Grid>
          <Grid item xs={9}>
            <SearchListingGroup />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SearchPage;

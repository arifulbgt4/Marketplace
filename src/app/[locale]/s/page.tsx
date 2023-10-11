import { Box, Container, Grid } from "@mui/material";

import ListSearchFilters from "src/widgets/ListSearchFilters";

const SearchPage = () => {
  return (
    <Box>
      <Container>
        <Grid container>
          <Grid item xs={3}>
            <ListSearchFilters />
          </Grid>
          <Grid item xs={9}>
            SearchListingGroup
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SearchPage;

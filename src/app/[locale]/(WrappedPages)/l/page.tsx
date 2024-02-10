import { Box, Container, Grid, Hidden } from "@mui/material";
import ListSearchFiltersForm from "src/forms/ListSearchFiltersForm";

import SearchListingGroup from "src/widgets/SearchListingGroup";

const ListingsSearchPage = () => {
  return (
    <Box>
      <Container>
        <Grid container columnSpacing={10}>
          <Hidden mdDown>
            <Grid item md={3}>
              <ListSearchFiltersForm />
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

export default ListingsSearchPage;

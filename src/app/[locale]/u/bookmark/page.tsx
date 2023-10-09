import { Box, Container, Grid } from "@mui/material";

import BookmarkItemGroup from "src/widgets/BookmarkItemGroup";
import LocationsMap from "src/widgets/LocationsMap";

const BookmarkPage = () => {
  return (
    <Box>
      <Container>
        <Grid container>
          <Grid item xs={8}>
            <BookmarkItemGroup />
          </Grid>
          <Grid item xs={4}>
            <LocationsMap />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BookmarkPage;

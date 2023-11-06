import { Paper, Container, Grid } from "@mui/material";

import BookmarkItemGroup from "src/widgets/BookmarkItemGroup";
import LocationsMap from "src/widgets/LocationsMap";

const BookmarkPage = () => {
  return (
    <Paper>
      <Container>
        <Grid container columnSpacing={10}>
          <Grid item xs={8}>
            <BookmarkItemGroup />
          </Grid>
          <Grid item xs={4}>
            <LocationsMap />
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
};

export default BookmarkPage;

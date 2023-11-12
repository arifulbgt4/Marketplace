import { Grid } from "@mui/material";

import BookmarkItemGroup from "src/widgets/BookmarkItemGroup";
import LocationsMap from "src/widgets/LocationsMap";

const BookmarkPage = () => {
  return (
    <Grid container columnSpacing={8} rowSpacing={5}>
      <Grid item md={8} xs={12}>
        <BookmarkItemGroup />
      </Grid>
      <Grid item md={4} xs={12}>
        <LocationsMap />
      </Grid>
    </Grid>
  );
};

export default BookmarkPage;

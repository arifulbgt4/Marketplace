import { Grid } from "@mui/material";

import BookmarkItemGroup from "src/widgets/BookmarkItemGroup";

const BookmarkPage = () => {
  return (
    <Grid container columnSpacing={8} rowSpacing={5}>
      <Grid item md={8} xs={12}>
        <BookmarkItemGroup />
      </Grid>
    </Grid>
  );
};

export default BookmarkPage;

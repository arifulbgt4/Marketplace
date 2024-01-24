"use client";
import { Grid, Typography } from "@mui/material";

import BookmarkItemGroup from "src/widgets/BookmarkItemGroup";

const BookmarkPage = () => {
  return (
    <Grid container rowSpacing={4}>
      <Grid item xs={12}>
        <Typography variant="h3" color={(theme) => theme.palette.text.primary}>
          Bookmars
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <BookmarkItemGroup />;
      </Grid>
    </Grid>
  );
};

export default BookmarkPage;

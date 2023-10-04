import { FC } from "react";
import { Grid, Paper } from "@mui/material";

import { BookmarksCardGroupProps } from "./Types";
import BookmarksCard from "../BookmarksCard";

const BookmarksCardGroup: FC<BookmarksCardGroupProps> = () => {
  return (
    <Paper elevation={11}>
      <Grid container>
        <Grid item xs={4}>
          <BookmarksCard />
        </Grid>
        <Grid item xs={4}>
          <BookmarksCard />
        </Grid>
        <Grid item xs={4}>
          <BookmarksCard />
        </Grid>
        <Grid item xs={4}>
          <BookmarksCard />
        </Grid>
        <Grid item xs={4}>
          <BookmarksCard />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BookmarksCardGroup;

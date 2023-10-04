import { Grid, Typography } from "@mui/material";

import BookmarksCard from "src/widgets/BookmarksCard";
import BookmarksCardGroup from "src/widgets/BookmarksCardGroup";
import UserMap from "src/widgets/UserMap";

const Bookmarks = () => {
  return (
    <Grid container>
      <Grid item xs={8}>
        <BookmarksCardGroup />
      </Grid>
      <Grid item xs={4}>
        <Typography variant="h4">use Location Map</Typography>
        <UserMap />
      </Grid>
    </Grid>
  );
};

export default Bookmarks;

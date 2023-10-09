import { Box, Container, Grid, Typography } from "@mui/material";

import BookmarksCardGroup from "src/widgets/BookmarksCardGroup";
import UserMap from "src/widgets/UserMap";

const BookmarkPage = () => {
  return (
    <Box>
      <Container>
        <Grid container>
          <Grid item xs={8}>
            <BookmarksCardGroup />
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h4">use Location Map</Typography>
            <UserMap />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Bookmarks;

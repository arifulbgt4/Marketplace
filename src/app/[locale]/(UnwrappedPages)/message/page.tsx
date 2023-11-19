"use client";
import { Container, Grid, Stack } from "@mui/material";

import MessageUsersSearch from "src/widgets/MessageUsersSearch";
import MessageContainer from "src/widgets/MessageContainer";

const MessagePage = () => {
  return (
    <Stack height="calc(100vh - 64px)">
      <Container>
        <Grid container>
          <Grid item xs={3}>
            <MessageUsersSearch />
          </Grid>
          <Grid item xs={9}>
            <MessageContainer />
          </Grid>
        </Grid>
      </Container>
    </Stack>
  );
};

export default MessagePage;

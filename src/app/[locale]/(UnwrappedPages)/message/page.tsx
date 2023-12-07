"use client";
import { Container, Grid, Stack } from "@mui/material";

import MessageUsersSearch from "src/widgets/MessageUsersSearch";
import MessageContainer from "src/widgets/MessageContainer";
import MyMessage from "src/widgets/MyMessage";

const MessagePage = () => {
  return (
    <Stack height="calc(100vh - 64px)">
      <Container>
        <Grid container>
          <Grid item xs={12}>
            <MyMessage />
          </Grid>
        </Grid>
      </Container>
    </Stack>
  );
};

export default MessagePage;

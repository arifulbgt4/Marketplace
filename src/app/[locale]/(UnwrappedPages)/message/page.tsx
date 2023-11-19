"use client";
import { Box, Container, Grid, Stack } from "@mui/material";

import ChatBox from "src/widgets/ChatBox";
import SendMessageForm from "src/forms/SendMessageForm";
import MessageUsersSearch from "src/widgets/MessageUsersSearch";

const MessagePage = () => {
  return (
    <Stack height="calc(100vh - 64px)">
      <Container>
        <Grid container>
          <Grid item xs={3}>
            <MessageUsersSearch />
          </Grid>

          <Grid item xs={9}>
            <Grid item xs={12}>
              <ChatBox />
            </Grid>
            <Grid item xs={12}>
              <SendMessageForm />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Stack>
  );
};

export default MessagePage;

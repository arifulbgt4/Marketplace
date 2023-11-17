"use client";
import { Container, Grid } from "@mui/material";

import SearchChatForm from "src/forms/SearchChatForm";
import ChatList from "src/widgets/ChatList";
import ChatBox from "src/widgets/ChatBox";
import SendMessageForm from "src/forms/SendMessageForm";

const MessagePage = () => {
  return (
    <Container>
      <Grid container>
        <Grid item xs={3}>
          <Grid
            item
            xs={12}
            px={2.8}
            py={1.2}
            borderBottom={1}
            borderColor={(theme) => theme.palette.action.disabledBackground}
            borderRadius={1}
          >
            <SearchChatForm />
          </Grid>
          <Grid item xs={12}>
            <ChatList />
          </Grid>
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
  );
};

export default MessagePage;

import { Container, Grid } from "@mui/material";

import SearchPeopleForm from "src/forms/SearchPeopleForm";
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
            borderBottom={
              "1px solid var(--action-disabled-background, rgba(0, 0, 0, 0.12))"
            }
            borderRadius={1}
          >
            <SearchPeopleForm />
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

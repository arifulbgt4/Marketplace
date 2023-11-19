import { FC } from "react";
import { Box, Grid, Stack } from "@mui/material";

import SearchChatForm from "src/forms/SearchChatForm";
import ChatList from "src/widgets/ChatList";

import { MessageUsersSearchProps } from "./Types";

const MessageUsersSearch: FC<MessageUsersSearchProps> = () => {
  return (
    <>
      <Box
        px={2.8}
        py={1.9}
        borderBottom={1}
        borderRadius={0.5}
        borderColor={(theme) => theme.palette.action.disabledBackground}
      >
        <SearchChatForm />
      </Box>
      <Box>
        <ChatList />
      </Box>
    </>
  );
};

export default MessageUsersSearch;

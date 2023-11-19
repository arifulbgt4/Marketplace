import { FC } from "react";
import { Box, Grid, Stack } from "@mui/material";

import SearchChatForm from "src/forms/SearchChatForm";
import ChatList from "src/widgets/ChatList";

import { MessageUsersSearchProps } from "./Types";

const MessageUsersSearch: FC<MessageUsersSearchProps> = () => {
  return (
    <Stack>
      <Box
        px={2.8}
        py={1.2}
        borderBottom={1}
        borderColor={(theme) => theme.palette.action.disabledBackground}
        borderRadius={1}
      >
        <SearchChatForm />
      </Box>
      <Box sx={{ maxHeight: "70vh", overflow: "auto" }}>
        <ChatList />
      </Box>
    </Stack>
  );
};

export default MessageUsersSearch;

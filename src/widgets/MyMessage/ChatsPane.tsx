import { useState } from "react";
import {
  Stack,
  Box,
  Chip,
  IconButton,
  TextField,
  Paper,
  InputAdornment,
  Typography,
  List,
} from "@mui/material";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import ChatListItem from "./ChatListItem";
import { toggleMessagesPane } from "./util";

import { ChatProps } from "./Types";

type ChatsPaneProps = {
  chats: ChatProps[];
  setSelectedChat: (chat: ChatProps) => void;
  selectedChatId: string;
};

export default function ChatsPane(props: ChatsPaneProps) {
  const { chats, setSelectedChat, selectedChatId } = props;
  const [state, setstate] = useState({
    query: "",
    list: chats,
  });
  const hanldeChatFilter = (e: any) => {
    const results = chats.filter((post) => {
      if (e.target.value === "") return chats;
      return post.sender.name
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });
    setstate({
      query: e.target.value,
      list: results,
    });
  };

  return (
    <Paper
      sx={{
        borderRight: "1px solid",
        borderColor: "divider",
        height: "calc(100vh - 64px)",
        overflowY: { xs: "scroll", lg: "auto" },
      }}
    >
      <Box position="sticky" top={2} zIndex={1} bgcolor="white">
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="space-between"
          p={2}
          pb={1.5}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography p={1}>Messages</Typography>
            <Chip label={4} size="small" />
          </Box>
          <IconButton
            size="small"
            aria-label="edit"
            sx={{ display: { xs: "none", sm: "unset" } }}
          >
            <EditNoteRoundedIcon />
          </IconButton>
          <IconButton
            aria-label="edit"
            size="small"
            onClick={() => {
              toggleMessagesPane();
            }}
            sx={{ display: { sm: "none" } }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
        <Box sx={{ px: 2, pb: 1.5 }}>
          <TextField
            fullWidth
            type="search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon />
                </InputAdornment>
              ),
            }}
            placeholder="Search"
            aria-label="Search"
            onChange={hanldeChatFilter}
          />
        </Box>
      </Box>
      <List
        sx={{
          py: 0,
          "--ListItem-paddingY": "0.75rem",
          "--ListItem-paddingX": "1rem",
        }}
      >
        {state.list.map((chat, index) => {
          return state.query === "" ? (
            <Box key={index}>
              <ChatListItem
                id={chat.id}
                sender={chat.sender}
                messages={chat.messages}
                setSelectedChat={setSelectedChat}
                selectedChatId={selectedChatId}
              />
            </Box>
          ) : (
            <ChatListItem
              id={chat.id}
              sender={chat.sender}
              messages={chat.messages}
              setSelectedChat={setSelectedChat}
              selectedChatId={selectedChatId}
            />
          );
        })}
      </List>
    </Paper>
  );
}

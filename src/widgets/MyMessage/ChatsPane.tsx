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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon />
                </InputAdornment>
              ),
            }}
            placeholder="Search"
            aria-label="Search"
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
        {chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            {...chat}
            setSelectedChat={setSelectedChat}
            selectedChatId={selectedChatId}
          />
        ))}
      </List>
    </Paper>
  );
}

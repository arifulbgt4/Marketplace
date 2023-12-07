import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Box, Chip, IconButton, Input } from "@mui/material";
import List from "@mui/material/List";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
// import ChatListItem from "./ChatListItem";
import { ChatProps } from "src/widgets/MyMessage/Tyepes";
import { toggleMessagesPane } from "src/widgets/MyMessage/util";
import { Paper } from "@mui/material";
import ChatListItem from "./ChatListItem";

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
        height: "calc(100dvh - var(--Header-height))",
        overflowY: "auto",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
        p={2}
        pb={1.5}
      >
        <Typography>Messages</Typography>
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
        <Input
          size="small"
          startAdornment={<SearchRoundedIcon />}
          placeholder="Search"
          aria-label="Search"
        />
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

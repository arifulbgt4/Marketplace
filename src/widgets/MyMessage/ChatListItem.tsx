import Box from "@mui/material/Box";
import {
  Divider,
  ListItem,
  ListItemButton,
  ListItemButtonProps,
  Stack,
  Typography,
} from "@mui/material";

import CircleIcon from "@mui/icons-material/Circle";

import { toggleMessagesPane } from "./util";
import AvatarWithStatus from "./AvatarWithStatus";

import { ChatProps, MessageProps, UserProps } from "./Types";

type ChatListItemProps = ListItemButtonProps & {
  id: string;
  unread?: boolean;
  sender: UserProps;
  messages: MessageProps[];
  selectedChatId?: string;
  setSelectedChat: (chat: ChatProps) => void;
};

export default function ChatListItem(props: ChatListItemProps) {
  const { id, sender, messages, selectedChatId, setSelectedChat } = props;
  const selected = selectedChatId === id;
  return (
    <ListItem>
      <ListItemButton
        onClick={() => {
          toggleMessagesPane();
          setSelectedChat({ id, sender, messages });
        }}
        selected={selected}
        sx={{
          flexDirection: "column",
          alignItems: "initial",
          gap: 1,
        }}
      >
        <Stack direction="row" spacing={1.5}>
          <AvatarWithStatus online={sender.online} src={sender.avatar} />
          <Box sx={{ flex: 1 }}>
            <Typography>{sender.name}</Typography>
            <Typography>{sender.username}</Typography>
          </Box>
          <Box
            sx={{
              lineHeight: 1.5,
              textAlign: "right",
            }}
          >
            {messages[0].unread && (
              <CircleIcon sx={{ fontSize: 12 }} color="primary" />
            )}
            <Typography display={{ xs: "none", md: "block" }} noWrap>
              5 mins ago
            </Typography>
          </Box>
        </Stack>
        <Typography
          variant="body2"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {messages[0].content}
        </Typography>
      </ListItemButton>
    </ListItem>
  );
}

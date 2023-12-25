import Box from "@mui/material/Box";
import {
  ListItem,
  ListItemButtonProps,
  Stack,
  Typography,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

import AvatarWithStatus from "./AvatarWithStatus";

import { ChatProps, MessageProps, UserProps } from "./Types";
import { useEffect, useRef } from "react";

type ChatListItemProps = ListItemButtonProps & {
  id: string;
  unread?: boolean;
  sender: UserProps;
  messages: MessageProps[];
  selectedChatId?: string;
  setSelectedChat: (chat: ChatProps) => void;
  CloseMobileDrawer?: any;
};

export default function ChatListItem(props: ChatListItemProps) {
  const {
    id,
    sender,
    messages,
    selectedChatId,
    setSelectedChat,
    CloseMobileDrawer,
  } = props;
  const selected = selectedChatId === id;

  // console.log("object", messages[messages.length - 1].content);

  const textAreaRef = useRef(null);

  return (
    <ListItem
      onClick={() => {
        setSelectedChat({ id, sender, messages });
        CloseMobileDrawer();
      }}
      selected={selected}
      sx={{
        display: "inherit",
        flexDirection: "column",
        alignItems: "initial",
        gap: 1,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack flexDirection="row" gap={1} alignItems="center">
          <AvatarWithStatus online={sender.online} src={sender.avatar} />
          <Box>
            <Typography variant="subtitle2">{sender.name}</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {sender.username}
            </Typography>
          </Box>
        </Stack>
        <Box>
          {messages[0].unread && (
            <CircleIcon sx={{ fontSize: 12 }} color="primary" />
          )}
          <Typography
            variant="caption"
            display={{ xs: "none", md: "block" }}
            noWrap
          >
            5 mins ago
          </Typography>
        </Box>
      </Stack>
      <Box>
        <Typography
          ref={textAreaRef}
          variant="subtitle2"
          color="text.secondary"
        >
          {messages[messages.length - 1].content.slice(0, 44)}
          {messages[messages.length - 1].content.length > 43 && "....."}
        </Typography>
      </Box>
    </ListItem>
  );
}

import { useState } from "react";
import {
  Button,
  Chip,
  IconButton,
  Stack,
  Box,
  Typography,
  Hidden,
  Drawer,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import PhoneInTalkRoundedIcon from "@mui/icons-material/PhoneInTalkRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

import ChatsPane from "./ChatsPane";
import { chats } from "./data";

import { ChatProps, UserProps } from "./Types";

type MessagesPaneHeaderProps = {
  sender: UserProps;
  setSelectedChat: (chat: ChatProps) => void;
  selectedChatId: string;
};

export default function MessagesPaneHeader(props: MessagesPaneHeaderProps) {
  const [open, setOpen] = useState(true);
  const openMobileDrawer = () => {
    setOpen(true);
  };
  const CloseMobileDrawer = () => {
    setOpen(false);
  };
  const { sender, setSelectedChat, selectedChatId } = props;

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
      py={{ xs: 2, md: 2 }}
      px={{ xs: 1, md: 2 }}
    >
      <Stack
        direction="row"
        gap={{ xs: 1, md: 2 }}
        alignItems="center"
        justifyContent="center"
      >
        <Hidden mdUp>
          <IconButton onClick={openMobileDrawer} size="small">
            <ArrowBackIosNewRoundedIcon fontSize="small" />
          </IconButton>
          <Drawer open={open} onClose={CloseMobileDrawer} anchor="left">
            <ChatsPane
              chats={chats}
              selectedChatId={selectedChatId}
              setSelectedChat={setSelectedChat}
              CloseMobileDrawer={CloseMobileDrawer}
            />
          </Drawer>
        </Hidden>
        {/* <Avatar sx={{ ml: 0 }} sizes="large" src={sender.avatar} /> */}
        <Box>
          <Stack flexDirection="row" gap={1}>
            <Typography variant="h6">{sender.name}</Typography>

            {sender.online ? (
              <Chip
                label="Online"
                variant="outlined"
                size="small"
                color="default"
                sx={{
                  borderRadius: 1,
                }}
                icon={
                  <CircleIcon sx={{ height: 10, width: 10 }} color="success" />
                }
              />
            ) : undefined}
          </Stack>

          <Typography variant="subtitle2" color="text.secondary">
            {sender.username}
          </Typography>
        </Box>
      </Stack>
      <Stack spacing={1} direction="row" alignItems="center">
        <Button
          startIcon={<PhoneInTalkRoundedIcon />}
          color="inherit"
          variant="outlined"
          size="small"
          sx={{
            display: { xs: "none", md: "inline-flex" },
          }}
        >
          Call
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="inherit"
          sx={{
            display: { xs: "none", md: "inline-flex" },
          }}
        >
          View profile
        </Button>
        <IconButton size="small">
          <MoreVertRoundedIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Stack>
  );
}

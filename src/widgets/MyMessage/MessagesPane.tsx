import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import MessagesPaneHeader from "./MessagesPaneHeader";
import { ChatProps, MessageProps } from "./Tyepes";
import AvatarWithStatus from "./AvatarWithStatus";
import { Typography } from "@mui/material";
import { useState, useEffect } from "react";
import ChatBubble from "./ChatBubble";
import MessageInput from "./MessageInput";

type MessagesPaneProps = {
  chat: ChatProps;
};

export default function MessagesPane(props: MessagesPaneProps) {
  const { chat } = props;
  const [chatMessages, setChatMessages] = useState(chat.messages);
  const [textAreaValue, setTextAreaValue] = useState("");

  useEffect(() => {
    setChatMessages(chat.messages);
  }, [chat.messages]);

  return (
    <Box
      sx={{
        height: { xs: "calc(100vh - 64px)", lg: "calc(100vh - 64px)" },
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.level1",
      }}
    >
      <MessagesPaneHeader sender={chat.sender} />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          px: 2,
          py: 3,
          overflowY: "scroll",
          flexDirection: "column",
        }}
      >
        <Stack spacing={2} justifyContent="flex-end">
          {chatMessages.map((message: MessageProps, index: number) => {
            const isYou = message.sender === "You";
            return (
              <Stack
                key={index}
                direction="row"
                spacing={2}
                flexDirection={isYou ? "row-reverse" : "row"}
              >
                {message.sender !== "You" && (
                  <AvatarWithStatus
                    online={message.sender.online}
                    src={message.sender.avatar}
                  />
                )}
                <ChatBubble
                  variant={isYou ? "sent" : "received"}
                  {...message}
                />
              </Stack>
            );
          })}
        </Stack>
      </Box>
      <MessageInput
        textAreaValue={textAreaValue}
        setTextAreaValue={setTextAreaValue}
        onSubmit={() => {
          const newId = chatMessages.length + 1;
          const newIdString = newId.toString();
          setChatMessages([
            ...chatMessages,
            {
              id: newIdString,
              sender: "You",
              content: textAreaValue,
              timestamp: "Just now",
            },
          ]);
        }}
      />
    </Box>
  );
}

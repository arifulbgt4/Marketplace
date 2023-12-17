import { useState, useEffect } from "react";
import { Stack, Paper } from "@mui/material";

import MessagesPaneHeader from "./MessagesPaneHeader";
import AvatarWithStatus from "./AvatarWithStatus";
import ChatBubble from "./ChatBubble";
import MessageInput from "./MessageInput";

import { ChatProps, MessageProps } from "./Types";

type MessagesPaneProps = {
  chat: ChatProps;
  setSelectedChat: (chat: ChatProps) => void;
  selectedChatId: string;

  msg?: any;
};

export default function MessagesPane(props: MessagesPaneProps) {
  const { chat, setSelectedChat, selectedChatId } = props;
  const [chatMessages, setChatMessages] = useState(chat.messages);
  const [textAreaValue, setTextAreaValue] = useState("");

  useEffect(() => {
    setChatMessages(chat.messages);
  }, [chat.messages]);

  return (
    <Stack
      component={Paper}
      top={52}
      height="calc(100vh - 64px)"
      bgcolor="background.default"
    >
      <MessagesPaneHeader
        setSelectedChat={setSelectedChat}
        selectedChatId={selectedChatId}
        sender={chat.sender}
      />
      <Stack
        flex={1}
        px={{ xs: 1, md: 2 }}
        py={{ xs: 2, md: 3 }}
        sx={{
          overflowY: "scroll",
          scrollBehavior: "smooth",
          scrollbarGutter: "end",
          flexDirection: "column-reverse",
        }}
      >
        <Stack spacing={2} justifyContent="flex-end">
          {chatMessages.map((message: MessageProps, index: number) => {
            const isYou = message.sender === "You";
            return (
              <Stack
                key={index}
                direction="row"
                gap={2}
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
      </Stack>
      <MessageInput
        textAreaValue={textAreaValue}
        setTextAreaValue={setTextAreaValue}
        onSubmit={() => {
          const newId = chatMessages.length + 1;
          const newIdString = newId.toString();
          chat.messages.push({
            id: newIdString,
            sender: "You",
            content: textAreaValue,
            timestamp: "Just now",
          });
        }}
      />
    </Stack>
  );
}

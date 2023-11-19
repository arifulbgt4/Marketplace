import { FC } from "react";
import { Stack } from "@mui/material";

import MessageForm from "src/forms/MessageForm";
import MessageUserHeader from "src/widgets/MessageUserHeader";
import MessageBody from "src/widgets/MessageBody";

import { MessageContainerProps } from "./Types";

const MessageContainer: FC<MessageContainerProps> = () => {
  return (
    <Stack
      sx={(theme) => ({
        borderLeft: `1px solid ${theme.palette.action.disabledBackground}`,
      })}
    >
      <MessageUserHeader />
      <MessageBody />
      <MessageForm />
    </Stack>
  );
};

export default MessageContainer;

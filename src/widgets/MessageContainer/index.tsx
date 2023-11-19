import { FC } from "react";
import ChatBox from "../ChatBox";
import SendMessageForm from "src/forms/SendMessageForm";

const MessageContainer = () => {
  return (
    <>
      <ChatBox />
      <SendMessageForm />
    </>
  );
};

export default MessageContainer;

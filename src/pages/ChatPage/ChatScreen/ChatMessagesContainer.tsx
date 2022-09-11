import React from "react";
import styled from "styled-components";

import { MessageType } from "../../../lib/types/MessageType";
import { UserType } from "../../../lib/types/UserType";
import MessageItem from "./MessageItem";

function ChatMessagesContainer({
  messages,
  scrollRef,
  currentUser,
  onScrollChatMessages,
  isLoadingPastMessages,
}: {
  messages: MessageType[];
  scrollRef: React.RefObject<HTMLDivElement>;
  currentUser: UserType | undefined;
  onScrollChatMessages: Function;
  isLoadingPastMessages: boolean;
}) {
  return (
    <Container>
      <div className="messages" ref={scrollRef} onScroll={() => onScrollChatMessages()}>
        {isLoadingPastMessages && <div> loading past messages</div>}
        {messages.map((message) => (
          <MessageItem message={message} />
        ))}
        <div className="end-of-message">End Of Messages</div>
      </div>
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 80%;

  .messages {
    overflow: scroll;
    height: 100vh;

    .end-of-message {
      overflow: break-word;
      padding: 1rem;
      font-size: 1.1rem;
    }
  }
`;
export default ChatMessagesContainer;

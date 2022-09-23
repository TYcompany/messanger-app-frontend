import React, { Suspense, useEffect, useState } from "react";
import styled from "styled-components";
import RingLoader from "../../../components/RingLoader/RingLoader";

import { MessageType } from "../../../lib/types/MessageType";
import { UserType } from "../../../lib/types/UserType";
import MessageItem from "./MessageItem";

function ChatMessagesContainer({
  messages,
  scrollRef,
  currentUser,
  onScrollChatMessages,
  isLoadingPastMessages,
  isLoadingInitialMessages,
}: {
  messages: MessageType[];
  scrollRef: React.RefObject<HTMLDivElement>;
  currentUser: UserType | undefined;
  onScrollChatMessages: Function;
  isLoadingPastMessages: boolean;
  isLoadingInitialMessages: boolean;
}) {
  const [isMessageHeaderMap, setIsMessageHeaderMap] = useState<{ [key: string]: boolean }>({});
  useEffect(() => {
    if (messages.length <= 0) {
      return;
    }
    const nextHeaderMap = { ...isMessageHeaderMap };

    nextHeaderMap[messages[0]._id] = true;
    for (let i = 1; i < messages.length; i++) {
      if (messages[i - 1].senderId === messages[i].senderId) {
        nextHeaderMap[messages[i]._id] = false;
      } else {
        nextHeaderMap[messages[i]._id] = true;
      }
    }
    setIsMessageHeaderMap(nextHeaderMap);
  }, [messages]);

  return (
    <Container>
      <div className="messages" ref={scrollRef} onScroll={() => onScrollChatMessages()}>
        {(isLoadingPastMessages || isLoadingInitialMessages) && <RingLoader />}
        {messages.map((message) => (
          <MessageItem
            isMessageHeaderMap={isMessageHeaderMap}
            key={"message" + message._id}
            message={message}
          />
        ))}

        {/* TODO change it to show messages exist below */}
        {/* <div className="end-of-message">End Of Messages</div> */}
      </div>
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 85%;

  @media screen and (max-width: 760px) {
    width: 100vw;
  }

  .messages {
    overflow: scroll;
    height: 100vh;

    @media screen and (max-width: 760px) {
      width: 100%;
    }

    .end-of-message {
      overflow: break-word;
      padding-bottom: 0.5rem;
      font-size: 1.1rem;
    }
  }
`;
export default ChatMessagesContainer;

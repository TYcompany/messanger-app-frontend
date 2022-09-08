import React, { useEffect, useState, useRef } from "react";
import { Buffer } from "buffer";
import styled from "styled-components";
import { useRecoilValue } from "recoil";

import { MessageType } from "../../lib/types/MessageType";

import ChatMessagesContainer from "./ChatMessagesContainer";
import ChatInput from "./ChatInput";

import { fetchMessagesInRange } from "../../lib/api/APIFunctions";

import Socket from "../../socket/socket";

import {
  currentlyChattingRoomState,
  currentlyChattingUserState,
  currentUserState,
} from "../../store/store";

const socket = new Socket().getSocketInstance();

function ChatScreen({
  isPickerActive,
  setIsPickerActive,
}: {
  isPickerActive: Boolean;
  setIsPickerActive: Function;
}) {
  const MessageQueryLimitPerReqeust = 20;

  const currentUser = useRecoilValue(currentUserState);
  const currentlyChattingUser = useRecoilValue(currentlyChattingUserState);
  const currentlyChattingRoom = useRecoilValue(currentlyChattingRoomState);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [receivedMessage, setRecievedMessage] = useState<MessageType | undefined>();
  const [pastMessages, setPastMessages] = useState<MessageType[]>([]);

  const [messageSequenceRef, setMessageSequenceRef] = useState(0);

  const [isLoadingPastMessages, setIsLoadingPastMessages] = useState(false);

  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessageSequenceRef(messages?.[0]?.messageSequence || 0);
  }, [messages]);

  const onScrollChatMessages = async () => {
    if (isLoadingPastMessages) {
      return;
    }

    const currentScroll = scrollRef.current?.scrollTop || 0;

    if (currentScroll > 0) {
      return;
    }

    setIsLoadingPastMessages(true);
    const data = await fetchPastMessages();
    setPastMessages(data);
  };

  const fetchPastMessages = async () => {
    if (!currentlyChattingRoom) {
      return;
    }

    const left = Math.max(messageSequenceRef - MessageQueryLimitPerReqeust, 0);
    const right = Math.max(messageSequenceRef, 20);
    
    const data = await fetchMessagesInRange(
      currentlyChattingRoom?._id,
      currentUser?._id || "",
      left,
      right
    );

    return data;
  };

  useEffect(() => {
    if (!currentlyChattingRoom) {
      return;
    }

    const initSocket = async () => {
      socket.removeAllListeners("message");
      socket.on("message", async (receivedMessage: MessageType) => {
        setRecievedMessage(receivedMessage);
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    };

    const init = async () => {
      const data = await fetchRecentMessages();

      setMessages(data || []);

      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      initSocket();
    };

    const fetchRecentMessages = async () => {
      const { totalMessageNumber } = currentlyChattingRoom;
      const left = Math.max(totalMessageNumber - 20, 0);
      const right = left + 20;

      const data = await fetchMessagesInRange(
        currentlyChattingRoom?._id,
        currentUser?._id || "",
        left,
        right
      );
      return data;
    };

    init();
  }, [currentlyChattingRoom]);

  const getUniqueMessages = (prevMessages: MessageType[]) => {
    const exists = new Set();
    const results = [];

    for (const prevMessage of prevMessages) {
      if (exists.has(prevMessage._id)) {
        continue;
      }
      exists.add(prevMessage._id);
      results.push(prevMessage);
    }
    return results;
  };

  useEffect(() => {
    receivedMessage && setMessages((prev) => getUniqueMessages([...prev, receivedMessage]));
  }, [receivedMessage]);

  useEffect(() => {
    if (!currentlyChattingRoom?.totalMessageNumber) {
      return;
    }

    setMessages((prev) =>
      getUniqueMessages(
        [...pastMessages, ...prev].sort((a, b) => a.messageSequence - b.messageSequence)
      )
    );
    setIsLoadingPastMessages(false);
  }, [pastMessages]);

  const sendMessage = async () => {
    if (!currentlyChattingRoom) {
      return;
    }

    const roomId = currentlyChattingRoom._id;

    const messageDto = {
      senderId: currentUser?._id,
      roomId,
      text,
      isPersonalChat: true,
    };

    socket.emit("message", messageDto);
    setText("");
  };

  return (
    <Container>
      {!currentlyChattingUser && (
        <div>welcome {currentUser?.userName}! please select person to chat with.</div>
      )}
      {currentlyChattingUser && (
        <>
          <div className="chat-header">
            <div className="user-details"></div>
            <div className="profile">
              <img
                src={`data:image/svg+xml;base64,${Buffer.from(
                  currentlyChattingUser?.profileImage || ""
                ).toString("base64")}`}
                alt="profile"
              />
              <div className="username">
                <h3>{currentlyChattingUser?.userName}</h3>
              </div>
            </div>
          </div>
          <ChatMessagesContainer
            messages={messages}
            currentUser={currentUser}
            scrollRef={scrollRef}
            onScrollChatMessages={onScrollChatMessages}
            isLoadingPastMessages={isLoadingPastMessages}
          />

          <ChatInput
            setText={setText}
            text={text}
            sendMessage={sendMessage}
            isPickerActive={isPickerActive}
            setIsPickerActive={setIsPickerActive}
          />
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  color: white;
  padding-top: 1rem;
  height: 80vh;

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .profile {
        img {
          height: 3rem;
        }
        .username {
          h3 {
            color: white;
          }
        }
      }
    }
  }
`;

export default ChatScreen;

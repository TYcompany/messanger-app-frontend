import React, { useEffect, useState, useRef } from "react";
import { Buffer } from "buffer";
import styled from "styled-components";

import { UserType } from "../../lib/types/UserType";
import { MessageType } from "../../lib/types/MessageType";
import { RoomType } from "../../lib/types/RoomType";

import ChatMessagesContainer from "./ChatMessagesContainer";
import ChatInput from "./ChatInput";

import { fetchMessagesInRange } from "../../lib/api/APIFunctions";

import Socket from "../../socket/socket";

const socket = new Socket().getSocketInstance();

function ChatScreen({
  currentUser,
  currentlyChattingUser,
  currentlyChattingRoom,
  isPickerActive,
  setIsPickerActive,
}: {
  currentUser: UserType | undefined;
  currentlyChattingUser: UserType | undefined;
  currentlyChattingRoom: RoomType | undefined;
  isPickerActive: Boolean;
  setIsPickerActive: Function;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [receivedMessage, setRecievedMessage] = useState<MessageType | undefined>();

  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentlyChattingRoom) {
      return;
    }

    const initSocket = async () => {
      socket.removeAllListeners("message");
      socket.on("message", async (receivedMessage: MessageType) => {
        const { messageSequence, text, updatedAt, _id, senderId } = receivedMessage;

        const nextMessage = {};
        setRecievedMessage(receivedMessage);
        console.log(receivedMessage);
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    };

    const init = async () => {
      const data = await fetchRecentMessages();

      setMessages(data || []);
      console.log(data);
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      initSocket();
    };

    const fetchRecentMessages = async () => {
      const { totalMessageNumber } = currentlyChattingRoom;
      const left = Math.max(totalMessageNumber - 20, 0);
      const right = totalMessageNumber + 1;

      const res = await fetchMessagesInRange(
        currentlyChattingRoom?._id,
        currentUser?._id || "",
        left,
        right
      );
      return res;
    };

    init();
  }, [currentlyChattingRoom]);

  useEffect(() => {
    receivedMessage && setMessages((prev) => [...prev, receivedMessage]);
  }, [receivedMessage]);

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
          />

          <ChatInput
            currentUser={currentUser}
            currentlyChattingUser={currentlyChattingUser}
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

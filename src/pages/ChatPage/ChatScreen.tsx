import React, { useEffect, useState, useRef } from "react";
import { Buffer } from "buffer";
import styled from "styled-components";

import { UserType } from "../../lib/types/UserType";
import { MessageType } from "../../lib/types/MessageType";
import { RoomType } from "../../lib/types/RoomType";

import ChatMessagesContainer from "./ChatMessagesContainer";
import ChatInput from "./ChatInput";

import axios from "axios";
import { GetAllmessagesRoute } from "../../lib/api/APIRoutes";

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
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentlyChattingRoom) {
      return;
    }
    console.log("currentChattingRoom", currentlyChattingRoom);

    fetchAllMessages(currentlyChattingRoom?._id);
    socket.removeAllListeners("message");
    socket.on("message", () => {
      fetchAllMessages(currentlyChattingRoom?._id);
      console.log(scrollRef.current?.scrollHeight);

      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, [currentlyChattingRoom]);

  const fetchAllMessages = async (roomId: string) => {
    if (!roomId) {
      return;
    }
    const res = await axios.get(
      `${GetAllmessagesRoute}?roomId=${roomId}&senderId=${currentUser?._id}`
    );

    setMessages(res.data);
  };

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
          <ChatMessagesContainer messages={messages} scrollRef={scrollRef} />

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

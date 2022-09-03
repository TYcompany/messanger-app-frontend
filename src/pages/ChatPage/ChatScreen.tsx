import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import styled from "styled-components";

import { UserType } from "../../lib/types/UserType";
import { MessageType } from "../../lib/types/MessageType";

import ChatMessagesContainer from "./ChatMessagesContainer";
import ChatInput from "./ChatInput";

import axios from "axios";
import { GetAllmessagesRoute } from "../../lib/api/APIRoutes";

import Socket from "../../socket/socket";

const socket = new Socket().getSocketInstance();

function ChatScreen({
  currentUser,
  currentlyChattingUser,
}: {
  currentUser: UserType | undefined;
  currentlyChattingUser: UserType | undefined;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const from = currentUser?._id;
    const to = currentlyChattingUser?._id;

    fetchAllMessages(from, to);
  }, [currentUser, currentlyChattingUser]);

  const fetchAllMessages = async (from: string | undefined, to: string | undefined) => {
    if (!from || !to) {
      return;
    }
    console.log('message fetched',from,to)
    const res = await axios.get(`${GetAllmessagesRoute}?from=${from}&to=${to}`);
    setMessages(res.data);
  };

  const sendMessage = async () => {
    const from = currentUser?._id;
    const to = currentlyChattingUser?._id;

    socket.emit("message", {
      from: currentUser?._id,
      to: currentlyChattingUser?._id,
      text,
    });
    socket.on("message", (data) => {
      console.log(data)
      fetchAllMessages(data.from, data.to);
    });
    fetchAllMessages(from, to);
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
          <ChatMessagesContainer messages={messages} />

          <ChatInput
            currentUser={currentUser}
            currentlyChattingUser={currentlyChattingUser}
            setText={setText}
            text={text}
            sendMessage={sendMessage}
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

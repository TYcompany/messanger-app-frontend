import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import styled from "styled-components";

import { UserType } from "../../lib/types/UserType";
import ChatInput from "./ChatInput";

function ChatScreen({
  currentUser,
  currentlyChattingUser,
}: {
  currentUser: UserType | undefined;
  currentlyChattingUser: UserType | undefined;
}) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log(currentlyChattingUser);
  }, [currentlyChattingUser]);

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
          <div className="chat-messages">this is chat messages</div>
          <ChatInput currentUser={currentUser} currentlyChattingUser={currentlyChattingUser} />
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  color: white;
  padding-top: 1rem;
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

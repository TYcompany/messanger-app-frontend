import React from "react";
import styled from "styled-components";

import { MessageType } from "../../lib/types/MessageType";

function ChatMessagesContainer({
  messages,
  scrollRef,
}: {
  messages: MessageType[];
  scrollRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <Container>
      <div className="messages">
        {messages.map((message) => {
          return (
            <div key={message._id} className={`message ${message.fromSelf ? "sent" : "recieved"}`}>
              <div className="content">
                <p>{message.text}</p>
              </div>
            </div>
          );
        })}
        <div className="end-of-message" ref={scrollRef}>
          End Of Messages
        </div>
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

    .message {
      overflow: scroll;
      display: flex;
      align-items: center;
      padding-left:1rem;
      padding-right:1rem;
      
      .content {
        max-width: 40%;
        overflow: break-word;
        padding: 1rem;
        font-size: 1.1.rem;
        border-radius: 1rem;
        color: #d1d1d1;
      }
    }
    .sent {
      justify-content: flex-end;
      background-color: #4f04ff21;
    }
    .recieved {
      justify-content: flex-start;
      background-color: #9900ff20;
    }

    .end-of-message {
      overflow: break-word;
      padding: 1rem;
      font-size: 1.1rem;
    }
  }
`;
export default ChatMessagesContainer;

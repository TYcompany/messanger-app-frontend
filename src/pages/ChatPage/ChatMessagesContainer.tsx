import React from "react";
import styled from "styled-components";

import { MessageType } from "../../lib/types/MessageType";

function ChatMessagesContainer({ messages }: { messages: MessageType[] }) {
  console.log(messages);

  return (
    <Container>
      {messages.map((message) => {
        return (
          <div key={message._id} className={`message ${message.fromSelf ? "sent" : "recieved"}`}>
            <div className="content">
              <p>{message.text}</p>
            </div>
          </div>
        );
      })}
    </Container>
  );
}
const Container = styled.div`
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  .message {
    overflow: scroll;
    display: flex;
    align-items: center;
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
`;
export default ChatMessagesContainer;

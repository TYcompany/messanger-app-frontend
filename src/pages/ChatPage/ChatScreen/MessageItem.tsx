import { useRecoilValue } from "recoil";
import styled from "styled-components";

import { MessageType } from "../../../lib/types/MessageType";
import { contactsMapState, currentUserState } from "../../../store/store";
import { Buffer } from "buffer";

function MessageItem({ message }: { message: MessageType }) {
  const currentUser = useRecoilValue(currentUserState);
  const contactsMap = useRecoilValue(contactsMapState);

  return (
    <Container>
      <div
        key={message._id}
        className={`message ${message.senderId === currentUser?._id ? "sent" : "recieved"}`}
      >
        <div className="content">
          {message.senderId !== currentUser?._id && (
            <div className="profile">
              <div className="profile-image">
                <img
                  src={`data:image/svg+xml;base64,${Buffer.from(
                    contactsMap[message.senderId]?.profileImage
                  ).toString("base64")}`}
                  alt={"profile" + contactsMap[message.senderId]._id}
                />
              </div>
              <div>{message.senderName}</div>
            </div>
          )}
          <div className="message-text">{message.text}</div>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  .message {
    overflow: scroll;
    display: flex;
    align-items: center;
    padding-left: 1rem;
    padding-right: 1rem;

    .content {
      max-width: 40%;
      overflow: break-word;
      padding: 1rem;
      font-size: 1.1.rem;
      border-radius: 1rem;
      color: #d1d1d1;
      .profile {
        width: 10rem;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        background-color: yellow;
        gap: 0.5rem;
        .profile-image {
          width: 2rem;
        }
      }

      .message-text {
        background-color: red;
        max-width: 20rem;
        overflow-wrap: break-word;

        text-align: left;
      }
    }
  }
  .sent {
    justify-content: flex-end;
    text-align: right;
    background-color: #4f04ff21;
  }
  .recieved {
    justify-content: flex-start;

    text-align: left;
    background-color: #9900ff20;
  }
`;

export default MessageItem;

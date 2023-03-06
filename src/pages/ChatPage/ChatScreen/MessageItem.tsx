import { useRecoilValue } from "recoil";
import styled from "styled-components";

import { MessageType } from "../../../lib/types/MessageType";
import {
  contactsMapState,
  currentlyChattingRoomState,
  currentlyChattingUserState,
  currentUserState,
} from "../../../store/store";
import { Buffer } from "buffer";
import { defaultProfileImageSVGString } from "../../../lib/images/defaultProfileImageData";
import { useNavigate } from "react-router-dom";

function MessageItem({
  message,
  isMessageHeaderMap,
}: {
  message: MessageType;
  isMessageHeaderMap: { [key: string]: boolean };
}) {
  const currentUser = useRecoilValue(currentUserState);
  const contactsMap = useRecoilValue(contactsMapState);
  const currentlyChattingRoom = useRecoilValue(currentlyChattingRoomState);
  const currentlyChattingUser = useRecoilValue(currentlyChattingUserState);
  const navigate = useNavigate();

  const onClickMessage = (roomId: string) => {
    const textLines = message.text?.split("\n");
    const currentTime = Date.now();

    const date = new Date(textLines[1]).getTime();
    const ExpirationDuration = 30 * 60 * 1000;

    if (textLines[0] === "Move To Video Chat Room!") {
      if (date + ExpirationDuration > currentTime) {
        navigate(
          `/video-chat?roomID=${currentlyChattingRoom._id}&userName=${currentlyChattingUser.userName}`
        );
        return;
      }

      alert("already expired. request again!");
      return;
    }
  };
  return (
    <Container onClick={() => onClickMessage(currentlyChattingRoom._id)}>
      <div className={`message ${message.senderId === currentUser?._id ? "sent" : "recieved"}`}>
        <div className="content">
          {message.senderId !== currentUser?._id && isMessageHeaderMap[message._id] && (
            <div className="profile">
              <div className="profile-image">
                <img
                  src={`${
                    contactsMap[message.senderId]?.profileImage || defaultProfileImageSVGString
                  }`}
                  alt={"profile" + contactsMap[message.senderId]?._id}
                />
              </div>
              <div>{message.senderName || contactsMap[message.senderId]?.userName}</div>
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
    display: flex;
    align-items: center;
    padding-left: 0.33rem;
    padding-right: 0.33rem;

    .content {
      max-width: 40%;
      overflow: break-word;
      padding: 0.5rem;
      font-size: 1.1.rem;
      border-radius: 1rem;
      color: #d1d1d1;
      .profile {
        width: 10rem;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        gap: 0.5rem;
        .profile-image {
          width: 2rem;
          img {
            border-radius: 50%;
            width: 2rem;
            height: 2rem;
          }
        }
      }

      .message-text {
        background-color: #3e4042;
        max-width: 20rem;
        overflow-wrap: break-word;

        text-align: left;
        border-radius: 1rem;
        padding: 0.5rem 0.77rem;
      }
    }
  }
  .sent {
    justify-content: flex-end;
    text-align: right;

    .content {
      .message-text {
        background-color: #0084ff;
      }
    }
  }
  .recieved {
    justify-content: flex-start;
    text-align: left;
  }
`;

export default MessageItem;

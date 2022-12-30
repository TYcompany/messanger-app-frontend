import React, { useEffect, useState, useRef, useCallback } from "react";

import styled from "styled-components";
import { useRecoilState, useRecoilValue } from "recoil";

import { MessageType } from "../../../lib/types/MessageType";

import ChatMessagesContainer from "./ChatMessagesContainer";
import ChatInput from "./ChatInput";

import { deleteUserFromGroupRoom, fetchMessagesInRange } from "../../../lib/api/APIFunctions";

import Socket from "../../../socket/socket";

import {
  activeModalNameState,
  currentlyChattingRoomState,
  currentlyChattingUserState,
  currentUserState,
  newMessageVisibleState,
} from "../../../store/store";
import { Button } from "@mui/material";
import BasicModal from "../../../components/modals/BasicModal";
import AddFriendModalComponent from "../ChatNavigation/modals/AddFriendModalComponent";
import InviteFriendModalComponent from "./modals/InviteFriendModalComponent";
import { isScrollNearBottom } from "./common/scrollRefLib";

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
  const [newMessageVisible, setNewMessageVisible] = useRecoilState(newMessageVisibleState);

  const [isLoadingInitialMessages, setIsLoadingInitialMessages] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [receivedMessage, setRecievedMessage] = useState<MessageType | undefined>();
  const [pastMessages, setPastMessages] = useState<MessageType[]>([]);

  const [messageSequenceRef, setMessageSequenceRef] = useState(0);

  const [isLoadingPastMessages, setIsLoadingPastMessages] = useState(false);

  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const [activeModalName, setActiveModalName] = useRecoilState(activeModalNameState);

  useEffect(() => {
    setMessageSequenceRef(messages?.[0]?.messageSequence || 0);
    const messageContainerRef = scrollRef.current;
    if (!messageContainerRef) {
      return;
    }
    if (isScrollNearBottom(messageContainerRef)) {
      messageContainerRef.scrollTo({ top: 20000, behavior: "smooth" });
    } else {
      setNewMessageVisible(true);
    }
  }, [messages]);

  const onScrollChatMessages = async () => {
    if (isLoadingPastMessages) {
      return;
    }

    if (scrollRef.current && isScrollNearBottom(scrollRef.current)) {
      setNewMessageVisible(false);
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
  const onRecieveNewMessage = (receivedMessage: MessageType) => {
    setRecievedMessage(receivedMessage);
  };
  useEffect(() => {
    const initSocket = async () => {
      socket.removeAllListeners("message");
      socket.on("message", async (receivedMessage: MessageType) => {
        onRecieveNewMessage(receivedMessage);
      });
    };
    initSocket();

    scrollRef.current?.scrollTo({ top: 20000, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!currentlyChattingRoom) {
      return;
    }

    const init = async () => {
      setIsLoadingInitialMessages(true);
      const data = await fetchRecentMessages();
      setMessages(data || []);
      setIsLoadingInitialMessages(false);
    };

    const fetchRecentMessages = async () => {
      const { totalMessageNumber } = currentlyChattingRoom;
      const left = Math.max(totalMessageNumber - 20, 0);
      const right = left + 20;

      if (!currentlyChattingRoom?._id || !currentUser?._id) {
        return [];
      }

      const data = await fetchMessagesInRange(
        currentlyChattingRoom._id,
        currentUser._id,
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
      senderName: currentUser?.userName,
      roomId,
      text,
      isPersonalChat: true,
    };

    socket.emit("message", messageDto);
    setText("");
  };

  const onClickInvite = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setActiveModalName("inviteFriend");
  };
  const onClickLeave = async () => {
    if (!window.confirm("Do you want to leave this room?")) {
      return;
    }
    const res = await deleteUserFromGroupRoom({
      userId: currentUser._id,
      roomId: currentlyChattingRoom._id,
    });

    window.location.reload();
  };

  return (
    <Container id="chat-screen">
      {!currentlyChattingUser?._id && (
        <div>welcome {currentUser?.userName}! please select person to chat with.</div>
      )}
      {currentlyChattingUser?._id && (
        <>
          {currentlyChattingRoom?.roomTitle ? (
            <div className="room-title-header">
              <div className="room-title-text">{currentlyChattingRoom?.roomTitle} </div>
              <div className="room-title-button-wrapper">
                <Button className="invite-friend-button" onClick={onClickInvite}>
                  Invite
                </Button>
                <Button onClick={onClickLeave} color="warning" className="leave-room-button">
                  Leave
                </Button>
              </div>
            </div>
          ) : (
            <div className="chat-header">
              <div className="profile">
                <img src={`${currentlyChattingUser?.profileImage || ""}`} alt="profile" />
                <div className="username">
                  <h3>{currentlyChattingUser?.userName}</h3>
                </div>
              </div>
            </div>
          )}

          <ChatMessagesContainer
            messages={messages}
            currentUser={currentUser}
            scrollRef={scrollRef}
            onScrollChatMessages={onScrollChatMessages}
            isLoadingPastMessages={isLoadingPastMessages}
            isLoadingInitialMessages={isLoadingInitialMessages}
          />

          <ChatInput
            setText={setText}
            text={text}
            sendMessage={sendMessage}
            isPickerActive={isPickerActive}
            setIsPickerActive={setIsPickerActive}
            scrollRef={scrollRef}
          />
        </>
      )}

      <BasicModal modalName="inviteFriend" ModalComponent={InviteFriendModalComponent}></BasicModal>
    </Container>
  );
}

const Container = styled.div`
  //color: white;
  padding-top: 1rem;
  height: 90vh;
  width: 100%;

  .room-title-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: space-between;
    padding-left: 1rem;
    padding-right: 1rem;

    .room-title-text {
      font-size: 2rem;
    }

    .room-title-button-wrapper {
      display: flex;
      flex-direction: row;
      gap: 0.5rem;
    }

    @media screen and (max-width: 760px) {
      width: calc(100vw - 2rem);
    }

    .invite-friend-button {
    }
    .leave-room-button {
    }
  }

  .chat-header {
    display: flex;

    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;

    .profile {
      display: flex;
      align-items: center;
      gap: 1rem;
      img {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
      }
      .username {
        h3 {
          // color: white;
        }
      }
    }
  }
`;

export default ChatScreen;

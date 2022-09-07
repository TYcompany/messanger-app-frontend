import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import ContactComponent from "./ContactComponent";
import ChatScreen from "./ChatScreen";

import { UserType } from "../../lib/types/UserType";

import { fetchUserContacts, fetchRoomDatasOfUser } from "../../lib/api/APIFunctions";

import Socket from "../../socket/socket";
import { useRecoilState } from "recoil";
import { currentUserState } from "../../store/store";
import { RoomType } from "../../lib/types/RoomType";

const socket = new Socket().getSocketInstance();

function ChatPage() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<UserType[]>([]);
  const [rooms, setRooms] = useState<RoomType[]>([]);

  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [isConnectedToSocket, setIsConnectedToSocket] = useState(false);

  const [isPickerActive, setIsPickerActive] = useState(false);

  const [selectedTab, setSelectedTab] = useState("contacts-tab-button");

  const onClickTab = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    setSelectedTab(e.currentTarget.name);
  };

  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(localStorage.getItem("chat-app-user") || "");

    setCurrentUser(user);

    socket.emit("add-user", { userId: user._id, userName: user.userName });
  }, [navigate]);

  useEffect(() => {
    if (!currentUser?._id) {
      return;
    }
    const init = async () => {
      const tempContacts = await fetchUserContacts(currentUser._id);
      setContacts(tempContacts);
      const tempRooms = await fetchRoomDatasOfUser(currentUser._id);
      setRooms(tempRooms);
      console.log(tempRooms);
      
    };

    init();
  }, [currentUser]);

  return (
    <Container
      onClick={(e) => {
        const isEmojiElement = !!(e.target as HTMLElement).closest(".emoji") || false;
        if (isEmojiElement) {
          return;
        }
        setIsPickerActive(false);
      }}
    >
      <div className="container">
        <div>
          <div>
            <button name="contacts-tab-button" onClick={(e) => onClickTab(e)}>
              Contacts
            </button>
            <button name="chatting-tab-button" onClick={(e) => onClickTab(e)}>
              Rooms
            </button>
          </div>

          <ContactComponent contacts={contacts} selectedTab={selectedTab} />

          <div className={selectedTab !== "chatting-tab-button" ? "display-none" : ""}>
            roomsComponet
            {rooms.map((room) => (
              <div key={room._id} >{room._id}</div>
            ))}
          </div>
        </div>
        <ChatScreen setIsPickerActive={setIsPickerActive} isPickerActive={isPickerActive} />
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;

  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
    .contactComponent {
    }
    .rooms-component {
      color: white;
    }
    .display-none {
      display: none;
    }
  }
`;

export default ChatPage;

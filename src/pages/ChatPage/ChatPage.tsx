import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import ContactComponent from "./ContactComponent";
import RoomComponent from "./RoomComponent";
import ChatScreen from "./ChatScreen";

import { UserMapType } from "../../lib/types/UserType";

import { fetchUserContacts, fetchRoomDatasOfUser } from "../../lib/api/APIFunctions";

import Socket from "../../socket/socket";
import { useRecoilState } from "recoil";
import { contactsMapState, currentUserState } from "../../store/store";
import { RoomType, RoomWithUserDataType } from "../../lib/types/RoomType";
import CreateRoomComponent from "./CreateRoomComponent";

const socket = new Socket().getSocketInstance();

const getRoomsWithUserName = (userId: string, contactsMap: UserMapType, rooms: RoomType[]) => {
  const results: RoomWithUserDataType[] = [];

  for (const room of rooms) {
    const userData = room.users.filter((user) => user !== userId).map((user) => contactsMap[user]);

    results.push({ ...room, userData });
  }

  return results;
};

function ChatPage() {
  const navigate = useNavigate();
  const [contactsMap, setContactsMap] = useRecoilState(contactsMapState);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [roomsWithUserName, setRoomsWithUserName] = useState<RoomWithUserDataType[]>([]);

  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [isConnectedToSocket, setIsConnectedToSocket] = useState(false);

  const [isPickerActive, setIsPickerActive] = useState(false);

  const [selectedTab, setSelectedTab] = useState("contacts-tab-button");

  const onClickTab = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    setSelectedTab(e.currentTarget.name);
  };
  const onClickCreateRoom = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
  };
  useEffect(() => {
    if (!contactsMap || !rooms || !currentUser?._id) {
      return;
    }

    const nextRoomsWithUsername = getRoomsWithUserName(currentUser._id, contactsMap, rooms);
    setRoomsWithUserName(nextRoomsWithUsername);
  }, [contactsMap, rooms]);

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
      const nextContacts: UserMapType = {};

      for (const tempContact of tempContacts) {
        nextContacts[tempContact._id] = tempContact;
      }

      setContactsMap(nextContacts);
      const tempRooms = await fetchRoomDatasOfUser(currentUser._id);
      setRooms(tempRooms);
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
        <div className="left-navs">
          <div>
            <button name="contacts-tab-button" onClick={(e) => onClickTab(e)}>
              Contacts
            </button>
            <button name="chatting-tab-button" onClick={(e) => onClickTab(e)}>
              Rooms
            </button>
            <button name="create-room-tab-button" onClick={(e) => onClickTab(e)}>
              Create New Room
            </button>
          </div>

          <ContactComponent selectedTab={selectedTab} />
          <RoomComponent selectedTab={selectedTab} roomsWithUserName={roomsWithUserName} />
          <CreateRoomComponent selectedTab={selectedTab} />
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

    .display-none {
      display: none;
    }
  }
  .create-room-button {
    position: fixed;
    bottom: 5rem;
    right: 5rem;
  }
`;

export default ChatPage;

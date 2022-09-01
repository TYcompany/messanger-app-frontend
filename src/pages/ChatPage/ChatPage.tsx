import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

import { FetchUserContactsRoute } from "../../lib/api/APIRoutes";
import ContactComponent from "./ContactComponent";
import ChatScreen from "./ChatScreen";

import { UserType } from "../../lib/types/UserType";
const socket = io();

function ChatPage() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<UserType[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType>();
  const [currentlyChattingUser, setCurrentlyChattingUser] = useState<UserType>();
  const [isConnectedToSocket, setIsConnectedToSocket] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
      return;
    }
    const user = localStorage.getItem("chat-app-user") || "";

    setCurrentUser(JSON.parse(user));
  }, [navigate]);

  useEffect(() => {
    if (!currentUser?._id) {
      return;
    }

    const fetchUserContacts = async (id: string) => {
      const res = await axios.get(`${FetchUserContactsRoute}/${id}`);
      const data = res?.data;

      const tempContacts = [];
      for (const dt of data) {
        const profileImage = await axios.get(dt.profileImageLink);
        tempContacts.push({ ...dt, profileImage: profileImage.data });
      }
      setContacts(tempContacts);
    };

    fetchUserContacts(currentUser._id);
  }, [currentUser]);

  useEffect(() => {
    
  }, []);

  return (
    <Container>
      <div className="container">
        <ContactComponent
          contacts={contacts}
          currentUser={currentUser}
          currentlyChattingUser={currentlyChattingUser}
          setCurrentlyChattingUser={setCurrentlyChattingUser}
        />
        <ChatScreen currentUser={currentUser} currentlyChattingUser={currentlyChattingUser} />
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
  }
`;

export default ChatPage;

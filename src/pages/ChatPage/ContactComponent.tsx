import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { UserType } from "../../lib/types/UserType";
import { Buffer } from "buffer";
import axios from "axios";
import { getRoomDataOfPersonalRoute } from "../../lib/api/APIRoutes";

function ContactComponent({
  contacts,
  currentUser,
  currentlyChattingUser,
  setCurrentlyChattingUser,
  setCurrentlyChattingRoom,
}: {
  contacts: Array<UserType>;
  currentUser: UserType | undefined;
  currentlyChattingUser: UserType | undefined;
  setCurrentlyChattingUser: Function;
  setCurrentlyChattingRoom: Function;
}) {
  const [selectedUser, setSelectedUser] = useState(0);
  useEffect(() => {
    if (!currentUser) {
      return;
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentlyChattingUser || !currentUser) {
      return;
    }

    const fetchRoomId = async () => {
      const users = [currentlyChattingUser._id, currentUser?._id].sort();
      const uri = `${getRoomDataOfPersonalRoute}?user1=${users[0]}&user2=${users[1]}`;
      const res = await axios.get(uri);
    
      setCurrentlyChattingRoom(res.data);
    };
    fetchRoomId();
  }, [currentlyChattingUser, currentUser]);

  const onClickUserContact = (index: number, contact: Object) => {
    setCurrentlyChattingUser(contact);
    setSelectedUser(index);
  };

  return (
    <Container>
      <div className="brand">
        <img src={""} alt="logo" />
        <h3>Chat</h3>
      </div>
      <div className="contacts">
        {contacts.map((contact, index) => (
          <div
            key={"contact" + index}
            className={`contact ${selectedUser === index && "selected"}`}
            onClick={() => onClickUserContact(index, contact)}
          >
            <div className="profile-image">
              <img
                src={`data:image/svg+xml;base64,${Buffer.from(contact.profileImage).toString(
                  "base64"
                )}`}
                alt={"profile" + index}
              />
            </div>
            <div className="username">
              <h3>{contact.userName}</h3>
            </div>
          </div>
        ))}
        <div key={"currently-chatting-user"} className={`currently-chatting-user`}>
          <div className="profile-image">
            <img
              src={`data:image/svg+xml;base64,${Buffer.from(
                currentlyChattingUser?.profileImage || ""
              ).toString("base64")}`}
              alt={"profile"}
            />
          </div>
          <div className="username">
            <h2>{currentlyChattingUser?.userName}</h2>
          </div>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: scroll;
  background-color: #080420;
  height: 90vh;

  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    .contact {
      &::-webkit-scrollbar {
        background-color: #ffffff39;
        width: 1rem;
        border-radius: 1rem;
      }
      background-color: #ffffff39;
      min-height: 5rem;
      width: 90%;
      cursor: pointer;
      border-radius: 0.2rem;
      padding: 0.4rem;
      gap: 1rem;
      align-items: center;
      display: flex;
      transition: 0.5s ease-in-out;

      .profile-image {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
    .selected {
      background-color: #9186f3;
    }
    .currently-chatting-user {
      background-color: #0d0d30;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      .profile-image {
        img {
          height: 4rem;
          max-inline-size: 100%;
        }
      }
      .username {
        h2 {
          color: white;
        }
      }

      @media screen and (min-width: 720px) and (max-width: 1080px) {
        gap: 0.5rem;
        .username {
          h2 {
            font-size: 1rem;
          }
        }
      }
    }
  }
`;

export default ContactComponent;

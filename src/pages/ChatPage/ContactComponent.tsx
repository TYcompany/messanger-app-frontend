import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useRecoilState, useRecoilValue } from "recoil";

import { UserType } from "../../lib/types/UserType";
import { Buffer } from "buffer";
import { fetchRoomData } from "../../lib/api/APIFunctions";
import {
  currentlyChattingUserState,
  currentlyChattingRoomState,
  currentUserState,
  contactsMapState,
  activeModalNameState,
} from "../../store/store";
import BasicModal from "./BasicModal";

function ContactComponent({ selectedTab }: { selectedTab: string }) {
  const [currentlyChattingUser, setCurrentlyChattingUser] = useRecoilState(
    currentlyChattingUserState
  );
  const currentUser = useRecoilValue(currentUserState);
  const contactsMap = useRecoilValue(contactsMapState);

  const [currentlyChattingRoom, setCurrentlyChattingRoom] = useRecoilState(
    currentlyChattingRoomState
  );
  const [activeModalName, setActiveModalName] = useRecoilState(activeModalNameState);

  const ExampleFC = () => <h3>Your chosen fruit is:</h3>;

  useEffect(() => {
    if (!currentUser) {
      return;
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentlyChattingUser?._id || !currentUser?._id) {
      return;
    }

    const init = async () => {
      const res = await fetchRoomData(currentlyChattingUser._id, currentUser?._id);
      setCurrentlyChattingRoom(res.data);
    };
    init();
  }, [currentlyChattingUser, currentUser]);

  const onClickUserContact = (contact: UserType) => {
    setCurrentlyChattingUser(contact);
  };

  const onClickAddFriend = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setActiveModalName("addFriend");
  };

  return (
    <Container>
      <div
        className={`contact-container ${
          selectedTab !== "contacts-tab-button" ? "display-none" : ""
        }`}
      >
        <div className="brand">
          <div className="profile-image">
            <img
              src={`data:image/svg+xml;base64,${Buffer.from(
                currentUser.profileImage || ""
              ).toString("base64")}`}
              alt={"profile-currentUser"}
            />
          </div>
          <div className="username">
            <h3>{currentUser.userName}</h3>
          </div>
        </div>
        <div className="contacts">
          {Object.values(contactsMap).map((contact) => (
            <div
              key={"contact" + contact._id}
              className={`contact ${currentlyChattingUser?._id === contact._id && "selected"}`}
              onClick={() => onClickUserContact(contact)}
            >
              <div className="profile-image">
                <img
                  src={`data:image/svg+xml;base64,${Buffer.from(contact.profileImage).toString(
                    "base64"
                  )}`}
                  alt={"profile" + contact._id}
                />
              </div>
              <div className="username">
                <h3>{contact.userName}</h3>
              </div>
            </div>
          ))}
        </div>
        <button className="add-friend-button" onClick={(e) => onClickAddFriend(e)}>
          Add Friend
        </button>
      </div>

      <BasicModal modalName="addFriend" ModalComponent={ExampleFC}></BasicModal>
    </Container>
  );
}

const Container = styled.div`
  .contact-container {
    display: grid;
    grid-template-rows: 10% 75% 15%;
    overflow: scroll;
    background-color: #080420;
    height: 80vh;

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
    .add-friend-button {
      font-size: 1rem;
      height: 2rem;
    }
  }
  .display-none {
    display: none;
  }
`;

export default ContactComponent;

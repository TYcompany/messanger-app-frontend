import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useRecoilState, useRecoilValue } from "recoil";

import { UserType } from "../../../lib/types/UserType";
import { Buffer } from "buffer";
import { fetchRoomData } from "../../../lib/api/APIFunctions";
import {
  currentlyChattingUserState,
  currentlyChattingRoomState,
  currentUserState,
  contactsMapState,
  activeModalNameState,
} from "../../../store/store";
import BasicModal from "../../../components/modals/BasicModal";
import AddFriendModalComponent from "./modals/AddFriendModalComponent";
import { Button } from "@mui/material";
import { removeAuthData } from "../../../lib/etc/etcFunctions";

function ContactComponent({ selectedTab }: { selectedTab: string }) {
  const navigate = useNavigate();

  const [currentlyChattingUser, setCurrentlyChattingUser] = useRecoilState(
    currentlyChattingUserState
  );
  const currentUser = useRecoilValue(currentUserState);
  const contactsMap = useRecoilValue(contactsMapState);

  useEffect(() => {
    console.log("contactsMap ", contactsMap);
  }, [contactsMap]);

  const [currentlyChattingRoom, setCurrentlyChattingRoom] = useRecoilState(
    currentlyChattingRoomState
  );
  const [activeModalName, setActiveModalName] = useRecoilState(activeModalNameState);

  const onClickUserContact = async (contact: UserType) => {
    setCurrentlyChattingUser(contact);

    const res = await fetchRoomData(currentUser?._id, contact?._id);

    setCurrentlyChattingRoom(res.data);
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
        <div className="contacts">
          {Object.values(contactsMap).map((contact) => (
            <div
              key={"contact" + contact._id}
              className={`contact ${currentlyChattingUser?._id === contact._id && "selected"}`}
              onClick={() => onClickUserContact(contact)}
            >
              <div className="profile-image">
                <img src={`${contact.profileImage || ""}`} alt={"profile" + contact._id} />
              </div>
              <div className="username">
                <h3>{contact.userName}</h3>
              </div>
            </div>
          ))}
        </div>
        <Button
          className="add-friend-button"
          variant="contained"
          onClick={(e) => onClickAddFriend(e)}
        >
          Add Friend
        </Button>
      </div>

      <BasicModal modalName="addFriend" ModalComponent={AddFriendModalComponent}></BasicModal>
    </Container>
  );
}

const Container = styled.div`
  .contact-container {
    .contacts {
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: auto;
      gap: 0.8rem;
      height: 60vh;
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
            width: 3rem;
            border-radius: 50%;
          }
        }
        .username {
          h3 {
            //   color: white;
          }
        }
      }
      .selected {
        background-color: #9186f3;
      }
      .currently-chatting-user {
        //background-color: #0d0d30;
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
      font-size: 1.2rem;
      width: 100%;
      margin-top: 1rem;
      height: 3rem;
    }
  }
  .display-none {
    display: none;
  }
`;

export default ContactComponent;

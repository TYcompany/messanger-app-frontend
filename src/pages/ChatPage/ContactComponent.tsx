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
} from "../../store/store";

function ContactComponent({
  contacts,
  selectedTab,
}: {
  contacts: Array<UserType>;
  selectedTab: string;
}) {
  const [currentlyChattingUser, setCurrentlyChattingUser] = useRecoilState(
    currentlyChattingUserState
  );
  const currentUser = useRecoilValue(currentUserState);
  const [currentlyChattingRoom, setCurrentlyChattingRoom] = useRecoilState(
    currentlyChattingRoomState
  );
  const [selectedUser, setSelectedUser] = useState(0);

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

  const onClickUserContact = (index: number, contact: UserType) => {
    setCurrentlyChattingUser(contact);
    setSelectedUser(index);
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
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  .contact-container {
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
    .display-none {
      display: none;
    }
  }
`;

export default ContactComponent;

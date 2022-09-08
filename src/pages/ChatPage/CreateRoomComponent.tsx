import React from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { Buffer } from "buffer";
import { contactsMapState } from "../../store/store";

function CreateRoomComponent({ selectedTab }: { selectedTab: string }) {
  const contactsMap = useRecoilValue(contactsMapState);

  return (
    <Container>
      <div
        className={`create-room-container ${
          selectedTab !== "create-room-tab-button" ? "display-none" : ""
        }`}
      >
        <input type='text' placeholder="room title" />
        <div className="contacts">
          {Object.values(contactsMap).map((contact) => (
            <div key={"contact" + contact._id} className={`contact`}>
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
      </div>
    </Container>
  );
}

const Container = styled.div`
  .create-room-container {
    display: grid;
    grid-template-rows: 10% 75% 15%;
    overflow: scroll;
    background-color: #080420;
    height: 80vh;

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
    }
    .display-none {
      display: none;
    }
  }
`;

export default CreateRoomComponent;

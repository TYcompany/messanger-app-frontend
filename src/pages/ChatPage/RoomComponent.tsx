import React from "react";
import { RoomWithUserNameType } from "../../lib/types/RoomType";
import styled from "styled-components";

function RoomComponent({
  selectedTab,
  roomsWithUserName,
}: {
  selectedTab: string;
  roomsWithUserName: RoomWithUserNameType[];
}) {
  return (
    <Container>
      <div
        className={`room-container ${selectedTab !== "chatting-tab-button" ? "display-none" : ""}`}
      >
        {roomsWithUserName.map((room) => (
          <div className="room" key={room._id}>
            {room.title || (room.userNames?.join(", "))}
          </div>
        ))}
      </div>
    </Container>
  );
}

const Container = styled.div`
  .room-container {
    display: flex;
    flex-direction:column ;
    overflow: scroll;
    background-color: #080420;
    height: 90vh;

    .room {
      color:white;
      overflow:ellipsis ;
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
    }
  }

  .display-none {
    display: none;
  }
`;

export default RoomComponent;

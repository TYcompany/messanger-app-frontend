import { RoomWithUserDataType } from "../../lib/types/RoomType";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { currentlyChattingRoomState, currentlyChattingUserState } from "../../store/store";

function RoomComponent({
  selectedTab,
  roomsWithUserName,
}: {
  selectedTab: string;
  roomsWithUserName: RoomWithUserDataType[];
}) {
  const [currentlyChattingRoom, setCurrentlyChattingRoom] = useRecoilState(
    currentlyChattingRoomState
  );
  const [currentChattingUser, setCurrentlyChattingUser] = useRecoilState(
    currentlyChattingUserState
  );

  const onClickRoom = (roomData: RoomWithUserDataType) => {
    setCurrentlyChattingRoom(roomData);
    setCurrentlyChattingUser(roomData.userData[0]);
  };
  return (
    <Container>
      <div
        className={`room-container ${selectedTab !== "chatting-tab-button" ? "display-none" : ""}`}
      >
        {roomsWithUserName.map((room) => (
          <div
            className={`room ${currentlyChattingRoom._id === room._id ? "selected" : ""}`}
            key={room._id}
            onClick={() => onClickRoom(room)}
          >
            {room.title || room.userData.map((userData) => userData?.userName)?.join(", ")} (
            {room.userData?.length})
          </div>
        ))}
      </div>
    </Container>
  );
}

const Container = styled.div`
  .room-container {
    display: flex;
    flex-direction: column;
    overflow: scroll;
    background-color: #080420;
    height: 90vh;

    .room {
      color: white;
      overflow: ellipsis;
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

    .selected {
      background-color: #9186f3;
    }
  }

  .display-none {
    display: none;
  }
`;

export default RoomComponent;

import { RoomWithUserDataType } from "../../lib/types/RoomType";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import {
  activeModalNameState,
  currentlyChattingRoomState,
  currentlyChattingUserState,
} from "../../store/store";
import BasicModal from "./BasicModal";


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
  const [activeModalName, setActiveModalName] = useRecoilState(activeModalNameState);

  const onClickRoom = (roomData: RoomWithUserDataType) => {
    setCurrentlyChattingRoom(roomData);
    setCurrentlyChattingUser(roomData.userData[0]);
  };

  const onClickCreateRoom = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setActiveModalName("createRoom");
  };

  const ExampleFC = () => <h3>Your chosen fruit is:</h3>;

  return (
    <Container>
      <div
        className={`room-container ${selectedTab !== "chatting-tab-button" ? "display-none" : ""}`}
      >
        <div className="rooms">
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
        <button className={`create-room-button`} onClick={(e) => onClickCreateRoom(e)}>
          Create New Room
        </button>
      </div>
      <BasicModal modalName="createRoom" ModalComponent={ExampleFC}></BasicModal>
    </Container>
  );
}

const Container = styled.div`
  background-color: white;
  .room-container {
    display: flex;
    flex-direction: column;
    .rooms {
      display: flex;
      flex-direction: column;
      overflow: scroll;
      background-color: #080420;
      height: 60vh;
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
    .create-room-button {
      font-size: 1rem;
    }
  }

  .display-none {
    display: none;
  }
`;

export default RoomComponent;

import { RoomWithUserDataType } from "../../../lib/types/RoomType";
import styled from "styled-components";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  activeModalNameState,
  contactsMapState,
  currentlyChattingRoomState,
  currentlyChattingUserState,
  roomsWithuserDataState,
} from "../../../store/store";
import BasicModal from "../../../components/modals/BasicModal";
import CreateRoomModalComponent from "./modals/CreateRoomModalComponent";
import { Button } from "@mui/material";
import { getUserDataByUserIds } from "../../../lib/api/APIFunctions";

function RoomComponent({ selectedTab }: { selectedTab: string }) {
  const [currentlyChattingRoom, setCurrentlyChattingRoom] = useRecoilState(
    currentlyChattingRoomState
  );
  const [currentChattingUser, setCurrentlyChattingUser] = useRecoilState(
    currentlyChattingUserState
  );
  const [activeModalName, setActiveModalName] = useRecoilState(activeModalNameState);
  const [roomsWithUserData, setRoomsWithUserData] = useRecoilState(roomsWithuserDataState);
  const [contactMap, setContactMap] = useRecoilState(contactsMapState);

  const onClickRoom = async (roomData: RoomWithUserDataType) => {
    let isEmptyValueContained = false;
    for (const userDt of roomData.userData) {
      if (!userDt) {
        isEmptyValueContained = true;
        break;
      }
    }

    if (isEmptyValueContained) {
      const userData = await getUserDataByUserIds(roomData.users);

      const nextContactMap = JSON.parse(JSON.stringify(contactMap));

      for (const userDt of userData) {
        nextContactMap[userDt._id] = userDt;
      }

      setContactMap(nextContactMap);

      roomData = { ...roomData, userData };
    }

    setRoomsWithUserData((prev) => [
      roomData,
      ...prev.filter((prevRoom) => prevRoom._id !== roomData._id),
    ]);
    setCurrentlyChattingRoom(roomData);

    setCurrentlyChattingUser(roomData.userData[0]);
  };

  const onClickCreateRoom = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setActiveModalName("createRoom");
  };

  return (
    <Container>
      <div
        className={`room-container ${selectedTab !== "chatting-tab-button" ? "display-none" : ""}`}
      >
        <div className="rooms">
          {roomsWithUserData.map((room: RoomWithUserDataType) => (
            <div
              className={`room ${currentlyChattingRoom._id === room._id ? "selected" : ""}`}
              key={room._id}
              onClick={() => onClickRoom(room)}
            >
              {room.roomTitle || room.userData.map((userData) => userData?.userName)?.join(", ")} (
              {room.userData?.length})
            </div>
          ))}
        </div>
        <Button className={`create-room-button`} onClick={(e) => onClickCreateRoom(e)}>
          Create Group Chat Room
        </Button>
      </div>
      <BasicModal modalName="createRoom" ModalComponent={CreateRoomModalComponent}></BasicModal>
    </Container>
  );
}

const Container = styled.div`
  .room-container {
    .rooms {
      display: flex;
      flex-direction: column;
      overflow: scroll;
      background-color: #080420;
      height: 60vh;
      .room {
        margin-bottom: 0.5rem;
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

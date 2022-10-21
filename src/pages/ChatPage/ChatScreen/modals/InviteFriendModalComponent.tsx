import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";

import {
  activeModalNameState,
  contactsMapState,
  currentlyChattingRoomState,
  currentUserState,
  roomsWithuserDataState,
} from "../../../../store/store";
import { UserType } from "../../../../lib/types/UserType";
import { addUsersToGroupRoom } from "../../../../lib/api/APIFunctions";
import { Box, Button, TextField } from "@mui/material";
import toast from "react-hot-toast";
import { RoomWithUserDataType } from "../../../../lib/types/RoomType";

function InviteFriendModalComponent() {
  const contactsMap = useRecoilValue(contactsMapState);
  const currentUser = useRecoilValue(currentUserState);

  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const currentlyChattingRoom = useRecoilValue(currentlyChattingRoomState);

  const [activeModalName, setActiveModalName] = useRecoilState(activeModalNameState);
  const [roomsWithUserData, setRoomsWithUserData] =
    useRecoilState<RoomWithUserDataType[]>(roomsWithuserDataState);

  const addSelectedUser = (userData: UserType) => {
    for (const selectedUser of selectedUsers) {
      if (selectedUser._id === userData._id) {
        return;
      }
    }
    setSelectedUsers([...selectedUsers, userData]);
  };
  const removeSelectedUser = (userData: UserType) => {
    setSelectedUsers([...selectedUsers.filter((u) => u._id !== userData._id)]);
  };

  const onSubmitInviteUsers = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedUsers?.length < 1) {
      toast.error("please select person to invite!");
      return;
    }

    try {
      const res = await addUsersToGroupRoom({
        userIds: selectedUsers.map((selectedUser) => selectedUser._id),
        roomId: currentlyChattingRoom._id,
      });

      toast.success("Successfully added!");

      //   const tempRooms = await fetchRoomDatasOfUser(currentUser._id);
      //   setRoomsWithUserData(getRoomsWithUserData(currentUser._id, contactsMap, tempRooms));

      setActiveModalName("");
    } catch (e) {
      console.log(e);
      toast.error("Add friend Failed!");
    }
  };
  return (
    <Container>
      <Box
        className="create-room-container"
        component="form"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => onSubmitInviteUsers(e)}
        noValidate
        sx={{ mt: 1 }}
      >
        <div className="selected-users">
          {selectedUsers.map((selectedUser) => (
            <div
              className="selected-user"
              key={"selected-user" + selectedUser._id}
              onClick={() => removeSelectedUser(selectedUser)}
            >
              {selectedUser.userName + " x"}
            </div>
          ))}
        </div>
        <div className="contacts">
          {Object.values(contactsMap).map((contact) => (
            <div
              onClick={() => addSelectedUser(contact)}
              key={"contact" + contact._id}
              className={`contact`}
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

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Invite
        </Button>
      </Box>
    </Container>
  );
}

const Container = styled.div`
  .create-room-container {
    display: flex;
    flex-direction: column;
    overflow: scroll;

    height: 80vh;

    .selected-users {
      display: flex;
      flex-direction: row;
      .selected-user {
        margin: 0.1rem;
        padding: 0.1rem 0.5rem;
        max-width: fit-content;

        border-radius: 1rem;
        background-color: gray;
        color: white;
        text-align: center;
      }
    }
    .contacts {
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: auto;
      gap: 0.5rem;
      .contact {
        &::-webkit-scrollbar {
          background-color: #ffffff39;
          width: 1rem;
          border-radius: 1rem;
        }
        background-color: #ffffff39;
        min-height: 2rem;
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
            color: gray;
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

export default InviteFriendModalComponent;

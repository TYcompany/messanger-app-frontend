import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { Buffer } from "buffer";
import { contactsMapState, currentUserState } from "../../../../store/store";
import { UserType } from "../../../../lib/types/UserType";
import { createGroupRoom } from "../../../../lib/api/APIFunctions";
import { Box, Button, TextField } from "@mui/material";

function CreateRoomModalComponent() {
  const contactsMap = useRecoilValue(contactsMapState);
  const currentUser = useRecoilValue(currentUserState);

  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const [roomTitle, setRoomTitle] = useState("");
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

  const onSubmitCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (roomTitle?.length < 3) {
      alert("Minimum length of room title is 3!");
      return;
    }
    if (selectedUsers?.length < 3) {
      alert("At least 3 people should be selected!");
      return;
    }

    const res = await createGroupRoom(
      roomTitle,
      selectedUsers.map((selectedUser) => selectedUser._id),
      currentUser._id
    );
    console.log(res);
  };
  return (
    <Container>
      <Box
        className="create-room-container"
        component="form"
        onSubmit={(e) => onSubmitCreateRoom(e)}
        noValidate
        sx={{ mt: 1 }}
      >
        <TextField
          className="room-title-input"
          margin="normal"
          required
          fullWidth
          id="room-title-input"
          name="room-title-input"
          label="room title"
          autoFocus
          type="text"
          placeholder="room title"
          value={roomTitle}
          onChange={(e) => setRoomTitle(e.currentTarget.value)}
        />

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

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Create
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

export default CreateRoomModalComponent;

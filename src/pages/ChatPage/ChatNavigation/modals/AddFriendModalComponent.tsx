import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import Box from "@mui/material/Box";
import { Buffer } from "buffer";

import { addFriend, fetchUserContacts, getUserDataByEmail } from "../../../../lib/api/APIFunctions";
import { UserMapType, UserType } from "../../../../lib/types/UserType";
import { activeModalNameState, contactsMapState, currentUserState } from "../../../../store/store";
import { useRecoilState, useRecoilValue } from "recoil";
import toast from "react-hot-toast";

function AddFriendModalComponent() {
  const [userData, setUserData] = useState<UserType | undefined>();
  const currentUser = useRecoilValue(currentUserState);
  const [activeModalName, setActiveModalName] = useRecoilState(activeModalNameState);
  const [contactsMap, setContactsMap] = useRecoilState(contactsMapState);

  const refreshUserContacts = async () => {
    const tempContacts = await fetchUserContacts(currentUser._id);
    const nextContacts: UserMapType = {};

    for (const tempContact of tempContacts) {
      nextContacts[tempContact._id] = tempContact;
    }

    setContactsMap(nextContacts);
  };

  function isValidEmail(email: string) {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData?.get("email")?.toString() || "";

    if (!isValidEmail(email)) {
      toast.error("Please type the valid email");
      return;
    }

    try {
      const data = await getUserDataByEmail(formData.get("email") as string);
      setUserData(data);
    } catch (e) {
      toast.error("Search with such email failed!");
    }
  };

  const onClickAddFriendButton = async () => {
    if (!currentUser?._id || !userData?._id) {
      return;
    }
    try {
      await addFriend(currentUser._id, userData._id);
      toast.success("Successfully added a friend");
      await refreshUserContacts();
      setActiveModalName("");
    } catch (e) {
      toast.error("Failed to add a friend!");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <div>Search With Email address</div>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
      />

      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Search
      </Button>
      <Box>
        {userData ? (
          <div
            key={"contact" + userData?._id}
            className={`contact`}
            onClick={() => onClickAddFriendButton()}
          >
            <div className="profile-image">
              <img src={`${userData?.profileImage || ""}`} alt={"profile" + userData?._id} />
            </div>
            <div className="username">
              <h3>{userData?.userName}</h3>
            </div>
            <Button variant="contained">Add</Button>
          </div>
        ) : (
          "No results"
        )}
      </Box>
    </Box>
  );
}

export default AddFriendModalComponent;

import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import Box from "@mui/material/Box";
import { Buffer } from "buffer";

import { addFriend, getUserDataByEmail } from "../../../../lib/api/APIFunctions";
import { UserType } from "../../../../lib/types/UserType";
import { currentUserState } from "../../../../store/store";
import { useRecoilValue } from "recoil";

function AddFriendModalComponent() {
  const [userData, setUserData] = useState<UserType | undefined>();
  const currentUser = useRecoilValue(currentUserState);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (!formData?.get("email")) {
      return;
    }
    const data = await getUserDataByEmail(formData.get("email") as string);
    setUserData(data);
  };

  const onClickAddFriendButton = async () => {
    if (!currentUser?._id || !userData?._id) {
      return;
    }

    const res = await addFriend(currentUser._id, userData._id);
    console.log(res);
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
              <img
                src={`data:image/svg+xml;base64,${Buffer.from(
                  userData?.profileImage || ""
                ).toString("base64")}`}
                alt={"profile" + userData?._id}
              />
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

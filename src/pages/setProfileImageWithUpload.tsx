import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";

import { setProfileImage, testRequest } from "../lib/api/APIFunctions";
import { removeAuthData } from "../lib/etc/etcFunctions";
import { currentUserState } from "../store/store";

function SetProfileImageWithUpload({
  customImageString,
  setCustomImageString,
}: {
  customImageString: string;
  setCustomImageString: Function;
}) {
  const navigate = useNavigate();

  const currentUser = useRecoilValue(currentUserState);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();

    if (!e?.target.files?.[0]) {
      return;
    }
    const fileSize = e.target.files?.[0].size / 1024 / 1024; // in MiB
    if (fileSize > 2) {
      alert("File size exceeds 2 MiB!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async function (evt: any) {
      if (evt.target.readyState !== 2) return;
      if (evt.target.error) {
        alert("Error while reading file!");
        return;
      }

      const filecontent = evt.target.result;

      setCustomImageString(filecontent);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const submitUpload = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    imageString: string
  ) => {
    if (!currentUser?._id || !imageString) {
      return;
    }
    const user = JSON.parse(localStorage.getItem("chat-app-user") || "");

    if (!user) {
      //toast.error("fail to get userData please login again!");
      removeAuthData();
      navigate("/login");
      return;
    }

    e.preventDefault();

    const res = await setProfileImage(user._id, imageString);

    user.profileImage = imageString;
    localStorage.setItem("chat-app-user", JSON.stringify(user));
    navigate("/chat");

    // toast.success("Successfully set profile image");
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={(e) => onChange(e)}></input>
    </div>
  );
}

export default SetProfileImageWithUpload;

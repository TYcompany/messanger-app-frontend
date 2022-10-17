import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import toast from "react-hot-toast";
import CubeLoader from "../components/CubeLoader";
import {
  fetchProfileImages,
  refreshAccessTokenCookies,
  setProfileImage,
} from "../lib/api/APIFunctions";
import SetProfileImageWithUpload from "./setProfileImageWithUpload";

import { Buffer } from "buffer";
import { removeAuthData } from "../lib/etc/etcFunctions";
import { Cookies } from "react-cookie";
import { currentUserState } from "../store/store";
import { useRecoilState } from "recoil";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const cookies = new Cookies();

function SetProfilePage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);

  const [isLoading, setIsLoading] = useState(true);

  const [customImageString, setCustomImageString] = useState<string>("");

  const [selectedProfileImage, setSelectedProfileImage] = useState(0);

  const [profileImages, setProfileImages] = useState<string[]>([]);

  useEffect(() => {
    const init = async () => {
      await refreshAccessTokenCookies();
    };

    if (cookies.get("access_token")) {
      init();
    }
  }, [navigate]);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const results = await fetchProfileImages(3);
      setProfileImages(["default iamge", ...results]);
      setIsLoading(false);
    };

    init();
  }, []);

  const submitSetProfileImage = async () => {
    const user = JSON.parse(localStorage.getItem("chat-app-user") || "");
    console.log(user);
    if (!user) {
      toast.error("fail to get userData please login again!");
      removeAuthData();
      navigate("/login");
      return;
    }
    let imageString = `data:image/svg+xml;base64,${Buffer.from(
      profileImages[selectedProfileImage] || ""
    ).toString("base64")}`;
    if (selectedProfileImage === 0) {
      imageString = customImageString || "";
    }

    const res = await setProfileImage(user._id, imageString);

    user.profileImage = imageString;
    user.profileImageLink = res.data.profileImageLink;

    localStorage.setItem("chat-app-user", JSON.stringify(user));

    navigate("/chat");

    toast.success("Successfully set profile image");
  };

  return (
    <>
      <div>SetProfile</div>
      <SetProfileImageWithUpload
        customImageString={customImageString}
        setCustomImageString={setCustomImageString}
      />
      {isLoading ? (
        <Container>
          {" "}
          <CubeLoader />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick your profile image</h1>
          </div>

          <div className="profile-images">
            {customImageString ? (
              <div
                key={"profile-image" + 0}
                className={`profile-image ${selectedProfileImage === 0 && "selected"}`}
              >
                <img
                  className={"profile-image-icon"}
                  src={customImageString}
                  alt={"profile" + 0}
                  onClick={() => setSelectedProfileImage(0)}
                />
              </div>
            ) : (
              <div className={`profile-image ${selectedProfileImage === 0 && "selected"}`}>
                <AccountCircleIcon
                  onClick={() => setSelectedProfileImage(0)}
                  className={"profile-image-icon"}
                />
              </div>
            )}
            {profileImages.map(
              (profileImage, index) =>
                index !== 0 && (
                  <div
                    key={"profile-image" + index}
                    className={`profile-image ${selectedProfileImage === index && "selected"}`}
                  >
                    <img
                      src={`data:image/svg+xml;base64,${Buffer.from(profileImage || "").toString(
                        "base64"
                      )}`}
                      alt={"profile" + index}
                      onClick={() => setSelectedProfileImage(index)}
                    />
                  </div>
                )
            )}
          </div>
          <button className={"submit-button"} onClick={() => submitSetProfileImage()}>
            Select
          </button>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  // background-color: #131324;
  height: 100vh;
  width: 100vw;
  /* .title-container {
    h1 {
      color: white;
    }
  } */
  .profile-images {
    display: flex;
    gap: 2rem;
    .profile-image {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      border-radius: 50%;
      overflow: hidden;
      .profile-image-icon {
        width: 6rem;
        height: 6rem;
        border-radius: 50%;
      }
      img {
        width: 6rem;
        height: 6rem;
        border-radius: 50%;
      }
    }
    .selected {
      border: 0.5rem solid #4e0;
    }
  }
  .submit-button {
    background-color: #997af0;
    color: white;
    padding: 1rem 2rem;
    border: none;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    transition: 0.5 ease-in-out;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;

export default SetProfilePage;

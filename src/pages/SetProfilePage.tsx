import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import toast, { Toaster } from "react-hot-toast";
import CubeLoader from "../components/CubeLoader";
import { fetchProfileImages, setProfileImage } from "../lib/api/APIFunctions";
import { Buffer } from "buffer";

function SetProfilePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProfileImage, setSelectedProfileImage] = useState(0);
  const [profileImages, setProfileImages] = useState<string[]>([]);

  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const results = await fetchProfileImages(4);
      setProfileImages(results);
      setIsLoading(false);
    };

    init();
  }, []);

  const setProfilePicture = async () => {
    const user = JSON.parse(localStorage.getItem("chat-app-user") || "");
    if (!user) {
      toast.error("fail to get userData please logout and login again!");
      return;
    }

    const res = await setProfileImage(user._id, profileImages[selectedProfileImage]);
    const data = res.data;
    user.profileImage = data.image;
    localStorage.setItem("chat-app-user", JSON.stringify(user));
    navigate("/");

    toast("Successfully set profile image");
  };

  return (
    <>
      <div>SetProfilePage</div>
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
            {profileImages.map((profileImage, index) => (
              <div
                key={"profile-image" + index}
                className={`profile-image ${selectedProfileImage === index && "selected"}`}
              >
                <img
                  src={`data:image/svg+xml;base64,${Buffer.from(profileImage).toString("base64")}`}
                  alt={"profile" + index}
                  onClick={() => setSelectedProfileImage(index)}
                />
              </div>
            ))}
          </div>
          <button className={"submit-button"} onClick={() => setProfilePicture()}>
            Select
          </button>
        </Container>
      )}

      <Toaster />
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;
  .title-container {
    h1 {
      color: white;
    }
  }
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

      img {
        height: 6rem;
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

import React, { useEffect, useState } from "react";
import { Tabs, Tab, Button } from "@mui/material";
import { PeopleAlt, ChatBubble } from "@mui/icons-material";
import ContactComponent from "./ContactComponent";
import RoomComponent from "./RoomComponent";
import { useRecoilValue } from "recoil";
import { currentUserState } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import { Buffer } from "buffer";
import styled from "styled-components";
import { removeAuthData } from "../../../lib/etc/etcFunctions";

import { defaultProfileImageSVGString } from "../../../lib/images/defaultProfileImageData";

const tabsInfo: { [key: number]: string } = {
  0: "contacts-tab-button",
  1: "chatting-tab-button",
};

function ChatNavigation() {
  const [selectedTab, setSelectedTab] = useState("contacts-tab-button");
  const [value, setValue] = useState(0);
  const currentUser = useRecoilValue(currentUserState);
  const navigate = useNavigate();

  const onClickProfileImage = () => {
    if (window.confirm("Want to move to setProfile page?")) {
      navigate("/setProfile");
    }
  };

  const onChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setSelectedTab(tabsInfo[newValue]);
  };

  const onLogout = async () => {
    removeAuthData();

    navigate("/login");
  };

  return (
    <Container>
      <div className="chat-navigation">
        <Tabs
          className="chat-navigation-tabs"
          value={value}
          onChange={onChangeTab}
          aria-label="basic tabs example"
        >
          <Tab
            className={`chat-navigation-tab ${value === 0 ? "selected-tab" : ""}`}
            label={<PeopleAlt fontSize="inherit" />}
          />
          <Tab
            className={`chat-navigation-tab ${value === 1 ? "selected-tab" : ""}`}
            label={<ChatBubble fontSize="inherit" />}
          />
        </Tabs>
        <div className="chat-navigation-contents">
          <div className="my-profile">
            <div className="profile-image">
              {
                <img
                  src={currentUser?.profileImage || defaultProfileImageSVGString}
                  alt={"profile-currentUser"}
                  onClick={() => onClickProfileImage()}
                />
              }
            </div>
            <div className="username">
              <h3>{currentUser?.userName}</h3>
            </div>
          </div>
          <Button onClick={() => onLogout()} variant="contained" color="secondary">
            Logout
          </Button>
          <ContactComponent selectedTab={selectedTab} />
          <RoomComponent selectedTab={selectedTab} />
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  width: 25vw;

  @media screen and (max-width: 750px) {
    width: 100%;
  }

  .chat-navigation-tabs {
    display: flex;
    align-items: space-between;
    justify-content: space-evenly;
    width: 100%;
    .chat-navigation-tab {
      color: #b0b3b8;
      font-size: 3rem;
      width: 50%;
    }
    .selected-tab {
      color: #1976d2;
    }
  }

  .chat-navigation-contents {
    //background: white;

    overflow-y: scroll;
    //background-color: #080420;
    height: 80vh;
    width: 100%;

    .my-profile {
      width: 100%;

      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      height: 3rem;
      font-size: 1.33rem;

      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
      img {
        cursor: pointer;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
      }
      h3 {
        // color: white;
      }
    }
  }
`;

export default ChatNavigation;

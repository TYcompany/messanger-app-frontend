import React, { useState } from "react";
import { Tabs, Tab, Button } from "@mui/material";
import { PeopleAlt, ChatBubble } from "@mui/icons-material";
import ContactComponent from "./ContactComponent";
import RoomComponent from "./RoomComponent";
import { useRecoilValue } from "recoil";
import { currentUserState } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import { Buffer } from "buffer";
import styled from "styled-components";

const tabsInfo: { [key: number]: string } = {
  0: "contacts-tab-button",
  1: "chatting-tab-button",
};

function ChatNavigation() {
  const [selectedTab, setSelectedTab] = useState("contacts-tab-button");
  const [value, setValue] = useState(0);
  const currentUser = useRecoilValue(currentUserState);
  const navigate = useNavigate();
  const onChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setSelectedTab(tabsInfo[newValue]);
  };

  const onLogout = () => {
    localStorage.setItem("chat-app-user", "");
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
          <Tab className={"chat-navigation-tab"} label={<PeopleAlt fontSize="inherit" />} />
          <Tab className={"chat-navigation-tab"} label={<ChatBubble fontSize="inherit" />} />
        </Tabs>
        <div className="chat-navigation-contents">
          <div className="my-profile">
            <div className="profile-image">
              <img
                src={`data:image/svg+xml;base64,${Buffer.from(
                  currentUser?.profileImage || ""
                ).toString("base64")}`}
                alt={"profile-currentUser"}
              />
            </div>
            <div className="username">
              <h3>{currentUser?.userName}</h3>
            </div>
            <Button onClick={() => onLogout()} variant="contained" color="secondary">
              Logout
            </Button>
          </div>

          <ContactComponent selectedTab={selectedTab} />
          <RoomComponent selectedTab={selectedTab} />
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  width: 25vw;

  .chat-navigation-tabs {
    display: flex;
    align-items: space-between;
    justify-content: space-evenly;
    width: 100%;

    .chat-navigation-tab {
      font-size: 3rem;
      //background-color: red;
      width: 50%;
    }
  }

  .chat-navigation-contents {
    background: white;

    overflow-y: scroll;
    background-color: #080420;
    height: 80vh;
    width: 100%;

    .my-profile {
      width: 100%;

      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      height: 3rem;
      font-size: 1.33rem;
      img {
        height: 2rem;
      }
      h3 {
        color: white;
      }
    }
  }
`;

export default ChatNavigation;

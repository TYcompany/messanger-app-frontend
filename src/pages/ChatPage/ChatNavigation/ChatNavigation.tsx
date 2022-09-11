import React, { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import { PeopleAlt, ChatBubble } from "@mui/icons-material";
import ContactComponent from "./ContactComponent";
import RoomComponent from "./RoomComponent";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const tabsInfo: { [key: number]: string } = {
  0: "contacts-tab-button",
  1: "chatting-tab-button",
};

function ChatNavigation() {
  const [selectedTab, setSelectedTab] = useState("contacts-tab-button");
  const [value, setValue] = useState(0);
  const onChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setSelectedTab(tabsInfo[newValue]);
  };

  return (
    <div className="chat-navigation">
      <Tabs value={value} onChange={onChangeTab} aria-label="basic tabs example">
        <Tab label={<PeopleAlt fontSize="large" />} {...a11yProps(0)} />
        <Tab label={<ChatBubble fontSize="large" />} {...a11yProps(1)} />
      </Tabs>

      <ContactComponent selectedTab={selectedTab} />
      <RoomComponent selectedTab={selectedTab} />
    </div>
  );
}

export default ChatNavigation;

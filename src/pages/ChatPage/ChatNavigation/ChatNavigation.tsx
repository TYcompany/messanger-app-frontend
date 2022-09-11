import React, { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import { PeopleAlt, ChatBubble } from "@mui/icons-material";
import ContactComponent from "./ContactComponent";
import RoomComponent from "./RoomComponent";

// function a11yProps(index: number) {
//   return {
//     id: `simple-tab-${index}`,
//     "aria-controls": `simple-tabpanel-${index}`,
//   };
// }
//{...a11yProps(1)}
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
        <Tab label={<PeopleAlt fontSize="large" />} />
        <Tab label={<ChatBubble fontSize="large" />} />
      </Tabs>

      <ContactComponent selectedTab={selectedTab} />
      <RoomComponent selectedTab={selectedTab} />
    </div>
  );
}

export default ChatNavigation;

import React, { useState } from "react";
import ContactComponent from "./ContactComponent";
import RoomComponent from "./RoomComponent";

function ChatNavigation() {
  const [selectedTab, setSelectedTab] = useState("contacts-tab-button");

  const onClickTab = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    setSelectedTab(e.currentTarget.name);
  };
  return (
    <div className="chat-navigation">
      <div>
        <button name="contacts-tab-button" onClick={(e) => onClickTab(e)}>
          Contacts
        </button>
        <button name="chatting-tab-button" onClick={(e) => onClickTab(e)}>
          Rooms
        </button>
      </div>

      <ContactComponent selectedTab={selectedTab} />
      <RoomComponent selectedTab={selectedTab} />
    </div>
  );
}

export default ChatNavigation;

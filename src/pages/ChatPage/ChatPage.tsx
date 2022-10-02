import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import ChatScreen from "./ChatScreen";

import { UserMapType } from "../../lib/types/UserType";

import {
  fetchUserContacts,
  fetchRoomDatasOfUser,
  refreshAccessToken,
  refreshAccessTokenCookies,
} from "../../lib/api/APIFunctions";

import Socket from "../../socket/socket";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  contactsMapState,
  currentUserState,
  roomsWithuserDataState,
  themeState,
} from "../../store/store";
import { RoomType, RoomWithUserDataType } from "../../lib/types/RoomType";
import { getRoomsWithUserData, removeAuthData } from "../../lib/etc/etcFunctions";

import ChatNavigation from "./ChatNavigation";

import toast from "react-hot-toast";
import { AppBar, Box, Drawer, IconButton, Toolbar, Typography } from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import themes, { ThemeType } from "../../styles/themes";

import { Cookies } from "react-cookie";

const cookies = new Cookies();

const socket = new Socket().getSocketInstance();

const drawerWidth = 240;

const MobileWidth = 760;
const isMobile = window.innerWidth <= MobileWidth;

function ChatPage() {
  //toggleTheme for test
  //   const [theme, setTheme] = useRecoilState(themeState);
  //   <button
  //   onClick={() => setTheme(theme === ThemeType.DARK ? ThemeType.LIGHT : ThemeType.DARK)}
  // >
  //   theme change
  // </button>

  const navigate = useNavigate();
  const [contactsMap, setContactsMap] = useRecoilState(contactsMapState);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [roomsWithUserData, setRoomsWithUserData] =
    useRecoilState<RoomWithUserDataType[]>(roomsWithuserDataState);

  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [isConnectedToSocket, setIsConnectedToSocket] = useState(false);

  const [isPickerActive, setIsPickerActive] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  const themeName = useRecoilValue(themeState);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    if (!contactsMap || !rooms || !currentUser?._id) {
      return;
    }

    setRoomsWithUserData(getRoomsWithUserData(currentUser._id, contactsMap, rooms));
  }, [contactsMap, rooms]);

  useEffect(() => {
    const init = async () => {
      await refreshAccessTokenCookies();
      const user = JSON.parse(localStorage.getItem("chat-app-user") || "");

      setCurrentUser(user);
      socket.emit("add-user", { userId: user._id, userName: user.userName });
    };

    if (cookies.get("access_token")) {
      init();
    } else {
      removeAuthData();
      navigate("/login");
    }
  }, [navigate]);

  const initUserContactsAndRooms = async () => {
    const tempContacts = await fetchUserContacts(currentUser._id);
    const nextContacts: UserMapType = {};

    for (const tempContact of tempContacts) {
      nextContacts[tempContact._id] = tempContact;
    }

    setContactsMap(nextContacts);
    let tempRooms;

    tempRooms = await fetchRoomDatasOfUser(currentUser._id);

    setRooms(tempRooms);
  };

  useEffect(() => {
    if (!currentUser?._id) {
      return;
    }
    initUserContactsAndRooms();
    console.log(currentUser);
  }, [currentUser]);

  return (
    <Container
      onClick={(e) => {
        const isEmojiElement = !!(e.target as HTMLElement).closest(".emoji") || false;
        if (isEmojiElement) {
          return;
        }
        setIsPickerActive(false);
      }}
    >
      <a className="skip-to-chat-screen" href="#chat-screen">
        Skip to Chat screen
      </a>

      <AppBar
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },

          display: { sm: "none" },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          {/* <Typography variant="h6" noWrap component="div">
            Responsive drawer
          </Typography> */}
        </Toolbar>
      </AppBar>

      <div className="container">
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              minWidth: `${isMobile ? "80%" : "20%"}`,
              backgroundColor: `${themes[themeName]?.background[0]}`,
            },
          }}
        >
          <ChatNavigation />
        </Drawer>

        <ChatScreen setIsPickerActive={setIsPickerActive} isPickerActive={isPickerActive} />
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: center;

  align-items: center;

  background-color: #131324;
  background-color: ${({ theme }) => theme.background[0]};

  .skip-to-chat-screen {
    position: fixed;
    display: hidden;

    &:focus {
      display: block;

      background: gray;
      width: 100vw;
      top: 0;
      font-size: 2rem;
    }
  }

  .container {
    display: grid;
    width: 100%;
    grid-template-columns: 25% 75%;
  }
`;

export default ChatPage;

import { atom } from "recoil";
import { MessageType } from "../lib/types/MessageType";
import { RoomType, RoomWithUserDataType } from "../lib/types/RoomType";
import { UserType, UserMapType } from "../lib/types/UserType";
import { ThemeType } from "../styles/themes";
import { v4 as uuid } from "uuid";

// room state, user, messages, currentUser, currentlyChattingRoom

export const registerStepState = atom<number>({
  key: "registerStep" + uuid(),
  default: 0,
});

export const registerInputValueState = atom({
  key: "registerInput" + uuid(),
  default: {
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
    passwordConfirm: "",
  },
});

export const themeState = atom<ThemeType>({
  key: "theme" + uuid(),
  default: ThemeType.DARK,
});

export const contactsMapState = atom<UserMapType>({
  key: "contactsMap" + uuid(),
  default: {
    "": {
      userName: "",
      email: "",
      profileImage: "",
      _id: "",
      profileImageLink: "",
    },
  },
});

export const roomsWithuserDataState = atom<RoomWithUserDataType[]>({
  key: "roomsWithUserData" + uuid(),
  default: [],
});

export const currentUserState = atom<UserType>({
  key: "currentUser" + uuid(),
  default: {
    userName: "",
    email: "",
    profileImage: "",
    _id: "",
    profileImageLink: "",
  },
});

export const currentlyChattingRoomState = atom<RoomType>({
  key: "currentlyChattingRoom" + uuid(),
  default: {
    createdAt: "",
    isPersonalChat: true,
    totalMessageNumber: 1,
    updatedAt: "",
    users: [],
    _id: "",
    roomTitle: "",
  },
});

export const currentlyChattingUserState = atom<UserType>({
  key: "currentlyChattingUser" + uuid(),
  default: {
    userName: "",
    email: "",
    profileImage: "",
    _id: "",
    profileImageLink: "",
  },
});

export const currentlyChattingMessagesState = atom<MessageType[]>({
  key: "currentlyChattingMessages" + uuid(),
  default: [],
});

export const activeModalNameState = atom<string>({
  key: "activeModalName" + uuid(),
  default: "",
});

// store messages for while
export const newMessageVisibleState = atom<boolean>({
  key: "newMessageVisible" + uuid(),
  default: false,
});




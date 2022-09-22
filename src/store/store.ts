import { atom } from "recoil";
import { MessageType } from "../lib/types/MessageType";
import { RoomType, RoomWithUserDataType } from "../lib/types/RoomType";
import { UserType, UserMapType } from "../lib/types/UserType";

// room state, user, messages, currentUser, currentlyChattingRoom

export const contactsMapState = atom<UserMapType>({
  key: "contactsMap",
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
  key: "roomsWithUserData",
  default: [],
});

export const currentUserState = atom<UserType>({
  key: "currentUser",
  default: {
    userName: "",
    email: "",
    profileImage: "",
    _id: "",
    profileImageLink: "",
  },
});

export const currentlyChattingRoomState = atom<RoomType>({
  key: "currentlyChattingRoom",
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
  key: "currentlyChattingUser",
  default: {
    userName: "",
    email: "",
    profileImage: "",
    _id: "",
    profileImageLink: "",
  },
});

export const currentlyChattingMessagesState = atom<MessageType[]>({
  key: "currentlyChattingMessages",
  default: [],
});

export const activeModalNameState = atom<string>({
  key: "activeModalName",
  default: "",
});

// store messages for while

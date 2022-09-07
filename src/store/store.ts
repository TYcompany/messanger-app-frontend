import { atom } from "recoil";
import { MessageType } from "../lib/types/MessageType";
import { RoomType } from "../lib/types/RoomType";
import { UserType } from "../lib/types/UserType";

// room state, user, messages, currentUser, currentlyChattingRoom

//contacts
// export const contactsState=atom({
//   key:'contacts'
// })

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
    _id: "currentlyChattingRoom",
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

// store messages for while

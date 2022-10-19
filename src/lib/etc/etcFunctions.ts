import { RoomType, RoomWithUserDataType } from "../types/RoomType";
import { UserMapType, UserType } from "../types/UserType";
import { Cookies } from "react-cookie";
import axios from "axios";

const cookies = new Cookies();

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getRoomsWithUserData = (
  userId: string,
  contactsMap: UserMapType,
  rooms: RoomType[]
) => {
  const results: RoomWithUserDataType[] = [];

  for (const room of rooms) {
    const userData = room.users.filter((user) => user !== userId).map((user) => contactsMap[user]);

    results.push({ ...room, userData });
  }

  return results;
};

export const setAuthData = (userData: UserType, access_token: string) => {
  cookies.set("access_token", access_token);
  axios.defaults.headers.common["Authorization"] = access_token;
  localStorage.setItem("chat-app-user", JSON.stringify(userData));
};

export const removeAuthData = () => {
  cookies.remove("access_token");
  //axios.defaults.headers.common["Authorization"] = "";
  localStorage.removeItem("chat-app-user");
};

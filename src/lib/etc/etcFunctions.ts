import { RoomType, RoomWithUserDataType } from "../types/RoomType";
import { UserMapType } from "../types/UserType";

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

import { UserType } from "./UserType";

export interface RoomType {
  title?: string;
  createdAt: string;
  isPersonalChat: boolean;
  totalMessageNumber: number;
  updatedAt: string;
  users: string[];
  _id: string;
}

export interface RoomWithUserDataType extends RoomType {
  userData: UserType[];
}

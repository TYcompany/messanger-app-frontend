export interface RoomType {
  title?: string;
  createdAt: string;
  isPersonalChat: boolean;
  totalMessageNumber: number;
  updatedAt: string;
  users: string[];
  _id: string;
}

export interface RoomWithUserNameType extends RoomType {
  userNames: string[];
}

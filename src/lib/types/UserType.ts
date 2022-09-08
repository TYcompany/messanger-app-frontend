export interface UserType {
  userName: string;
  email: string;
  profileImage: string;
  _id: string;
  profileImageLink: string;
}

export interface UserMapType {
  [key: string]: UserType;
}

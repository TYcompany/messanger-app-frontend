import axios from "axios";
import {
  LoginRoute,
  RegisterRoute,
  GetMessagesInRangeRoute,
  FetchUserContactsRoute,
  FetchProfileImagesRoute,
  SetProfileImageRoute,
  GetRoomDataOfPersonalRoute,
} from "./APIRoutes";

export const loginRequest = async (userName: string, password: string) => {
  return await axios.post(LoginRoute, {
    userName,
    password,
  });
};

export const registerRequest = async ({
  userName,
  email,
  password,
  passwordConfirm,
}: {
  userName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}) => {
  return await axios.post(RegisterRoute, {
    userName,
    email,
    password,
    passwordConfirm,
  });
};

export const fetchRoomData = async (user1: string, user2: string) => {
  const users = [user1, user2].sort();
  const uri = `${GetRoomDataOfPersonalRoute}?user1=${users[0]}&user2=${users[1]}`;
  return await axios.get(uri);
};

export const fetchMessagesInRange = async (
  roomId: string,
  senderId: string,
  left: number,
  right: number
) => {
  const res = await axios.get(
    `${GetMessagesInRangeRoute}?roomId=${roomId}&senderId=${senderId}
      &left=${left}&right=${right}`
  );
  return res.data;
};

export const fetchUserContacts = async (id: string) => {
  const res = await axios.get(`${FetchUserContactsRoute}/${id}`);
  const data = res?.data;

  const tempContacts = [];
  for (const dt of data) {
    const profileImage = await axios.get(dt.profileImageLink);
    tempContacts.push({ ...dt, profileImage: profileImage.data });
  }
  return tempContacts;
};

export const fetchProfileImages = async (numberOfImages: number) => {
  const res = await axios.get(FetchProfileImagesRoute + "/" + numberOfImages);
  return res.data;
};

export const setProfileImage = async (id: string, profileImage: string) => {
  return await axios.post(`${SetProfileImageRoute}/${id}`, {
    profileImage,
  });
};
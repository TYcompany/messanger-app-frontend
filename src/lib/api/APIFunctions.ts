import axios from "axios";
import {
  LoginRoute,
  RegisterRoute,
  GetMessagesInRangeRoute,
  FetchUserContactsRoute,
  FetchProfileImagesRoute,
  SetProfileImageRoute,
  GetRoomDataOfPersonalRoute,
  GetRoomDatasOfUser,
  GetUserDataByEmailRoute,
  AddFriendRoute,
  DeleteFriendRoute,
  CreateGroupRoomRoute,
  GetUserDataByUserIdsRoute,
  RefreshAccessTokenRoute,
  TestRoute,
} from "./APIRoutes";
import { sleep } from "../etc/etcFunctions";
import { UserType } from "../types/UserType";

import { Cookies } from "react-cookie";

//if only querying data(if fails just they can return empty data), just return data ,else return response itself

const cookies = new Cookies();

export const refreshAccessToken = async (access_token: string) => {
  const res = await axios.post(RefreshAccessTokenRoute, {
    access_token,
  });
  return res.data;
};

export const refreshAccessTokenCookies = async () => {
  const access_token = await refreshAccessToken(cookies.get("access_token"));
  cookies.set("access_token", access_token);
};

export const loginRequest = async (userName: string, password: string) => {
  return await axios.post(LoginRoute, {
    userName,
    password,
  });
};

export const testRequest = async (body: any) => {
  return await axios.post(TestRoute, body);
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

export const addFriend = async (currentUserId: string, friendUserId: string) => {
  const res = await axios.post(`${AddFriendRoute}`, {
    currentUserId,
    friendUserId,
  });
  return res;
};

export const deleteFriend = async (currentUserId: string, friendUserId: string) => {
  const res = await axios.post(`${DeleteFriendRoute}`, {
    currentUserId,
    friendUserId,
  });
  return res;
};

const getUserDataWithProfileImage = async (dt: UserType) => {
  try {
    const profileImage = await axios.get(dt.profileImageLink, {
      headers: {
        Authorization: "",
      },
    });
    return { ...dt, profileImage: profileImage?.data || "" };
  } catch (e) {
    console.log(e);
    return { ...dt, profileImage: "" };
  }
};

export const fetchUserContacts = async (id: string) => {
  const res = await axios.get(`${FetchUserContactsRoute}/${id}`);
  const data = res?.data;

  const promises = [];
  for (const dt of data) {
    const promise = getUserDataWithProfileImage(dt);
    promises.push(promise);
  }
  const results = await Promise.all(promises);
  return results;
};

export const getUserDataByEmail = async (email: string) => {
  const res = await axios.get(`${GetUserDataByEmailRoute}?email=${email}`);
  const data = res?.data;
  const result = await getUserDataWithProfileImage(data);
  return result;
};

export const getUserDataByUserIds = async (userIds: string[]) => {
  const res = await axios.post(`${GetUserDataByUserIdsRoute}`, {
    userIds,
  });
  const userDatas: UserType[] = res.data;
  const promises = [];

  for (const userData of userDatas) {
    promises.push(getUserDataWithProfileImage(userData));
  }
  return await Promise.all(promises);
};

export const fetchRoomData = async (user1: string, user2: string) => {
  if (user1.length !== 24 || user2.length !== 24) {
    console.log("user id is invalid both should be 24");
    return { data: {} };
  }
  const users = [user1, user2].sort();
  const uri = `${GetRoomDataOfPersonalRoute}?user1=${users[0]}&user2=${users[1]}`;
  return await axios.get(uri);
};

export const fetchRoomDatasOfUser = async (userId: string) => {
  if (userId.length !== 24) {
    console.log("user id is invalid should be 24");
    return { data: {} };
  }
  const uri = `${GetRoomDatasOfUser}?userId=${userId}`;
  const res = await axios.get(uri);

  return res.data;
};

export const createGroupRoom = async (roomTitle: string, users: string[], roomHost: string) => {
  const dto = {
    roomTitle,
    users,
    roomHost,
  };
  const res = await axios.post(CreateGroupRoomRoute, dto);
  return res;
};

export const fetchMessagesInRange = async (
  roomId: string,
  senderId: string,
  left: number,
  right: number
) => {
  await sleep(500);

  const res = await axios.get(
    `${GetMessagesInRangeRoute}?roomId=${roomId}&senderId=${senderId}
      &left=${left}&right=${right}`
  );
  return res.data;
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

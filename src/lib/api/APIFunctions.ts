import axios, { AxiosError } from "axios";
import {
  LoginRoute,
  RegisterRoute,
  GetMessagesInRangeRoute,
  FetchUserContactsRoute,
  FetchProfileImagesRoute,
  SetProfileImageRoute,
  GetRoomDataOfPersonalRoute,
  GetRoomDatasOfUserRoute,
  GetUserDataByEmailRoute,
  AddFriendRoute,
  DeleteFriendRoute,
  CreateGroupRoomRoute,
  GetUserDataByUserIdsRoute,
  RefreshAccessTokenRoute,
  TestRoute,
  RegisterByPhoneNumberRoute,
  ValidatePhoneNumberRoute,
  HealthCheckRoute,
  RegisterByEmailRoute,
  LoginByEmailRoute,
  LoginByPhoneNumberRoute,
  GetUserDataByPhoneNumberRoute,
  AddUsersToGroupRoomRoute,
  DeleteUserFromGroupRoomRoute,
} from "./APIRoutes";
import { sleep } from "../etc/etcFunctions";
import { UserType } from "../types/UserType";

import { Cookies } from "react-cookie";
import { NOTFOUND } from "dns";

//if only querying data(if fails just they can return empty data), just return data ,else return response itself

const cookies = new Cookies();

export const healthCheck = async () => {
  const res = await axios.get(HealthCheckRoute);
  return res;
};

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

export const loginByEmail = async (email: string, password: string) => {
  return await axios.post(LoginByEmailRoute, {
    email,
    password,
  });
};
export const loginByPhoneNumber = async (phoneNumber: string, password: string) => {
  return await axios.post(LoginByPhoneNumberRoute, {
    phoneNumber,
    password,
  });
};

export const testRequest = async (userId: string, profileImage: string) => {
  return await axios.post(TestRoute, { userId, profileImage });
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

export const registerByEmail = async ({
  userName,
  password,
  email,
}: {
  userName: string;
  password: string;
  email: string;
}) => {
  const res = await axios.post(RegisterByEmailRoute, {
    userName,
    password,
    email,
  });
  return res;
};

export const registerByPhoneNumber = async ({
  userName,
  password,
  phoneNumber,
}: {
  userName: string;
  password: string;
  phoneNumber: string;
}) => {
  const res = await axios.post(RegisterByPhoneNumberRoute, {
    userName,
    password,
    phoneNumber,
  });
  return res;
};

export const validatePhoneNumber = async ({
  phoneNumber,
  phoneNumberConfirmToken,
}: {
  phoneNumber: string;
  phoneNumberConfirmToken: string;
}) => {
  const res = await axios.post(ValidatePhoneNumberRoute, { phoneNumber, phoneNumberConfirmToken });

  return res;
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
  const res = await axios.get(`${GetUserDataByEmailRoute}/${email}`);

  const data = res?.data;

  if (data.error) {
    return data;
  }

  const result = await getUserDataWithProfileImage(data);
  return result;
};

export const getUserDataByPhoneNumber = async (phoneNumber: string) => {
  const res = await axios.get(`${GetUserDataByPhoneNumberRoute}/${phoneNumber}`);

  const data = res?.data;

  if (data.error) {
    return data;
  }

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
  
  return await axios.post(GetRoomDataOfPersonalRoute, {
    user1: users[0],
    user2: users[1],
  });
};

export const fetchRoomDatasOfUser = async (userId: string) => {
  if (userId.length !== 24) {
    console.log("user id is invalid should be 24");
    return { data: {} };
  }
  const uri = `${GetRoomDatasOfUserRoute}/${userId}`;
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

// export const addUserToGroupRoom = async ({
//   userId,
//   roomId,
// }: {
//   userId: string;
//   roomId: string;
// }) => {
//   const res = await axios.post(AddUserToGroupRoomRoute, { userId, roomId });
//   return res;
// };

export const addUsersToGroupRoom = async ({
  userIds,
  roomId,
}: {
  userIds: string[];
  roomId: string;
}) => {
  const res = await axios.post(AddUsersToGroupRoomRoute, { userIds, roomId });
  return res;
};

export const deleteUserFromGroupRoom = async ({
  userId,
  roomId,
}: {
  userId: string;
  roomId: string;
}) => {
  const res = await axios.post(DeleteUserFromGroupRoomRoute, { userId, roomId });
  return res;
};

export const fetchMessagesInRange = async (
  roomId: string,
  senderId: string,
  left: number,
  right: number
) => {
  await sleep(500);

  const res = await axios.post(GetMessagesInRangeRoute, {
    roomId,
    left,
    right,
  });

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

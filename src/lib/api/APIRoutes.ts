const host = process.env.REACT_APP_HOST_URL || "http://localhost:5000";

export const HealthCheckRoute = `${host}`;

export const RefreshAccessTokenRoute = `${host}/auth/refreshAccessToken`;
export const RegisterRoute = `${host}/auth/register`;
export const RegisterByPhoneNumberRoute = `${host}/auth/registerByPhoneNumber`;
export const ValidatePhoneNumberRoute = `${host}/auth/validatePhoneNumber`;
export const RegisterByEmailRoute = `${host}/auth/registerByEmail`;

export const LoginRoute = `${host}/auth/login`;
export const LoginByEmailRoute = `${host}/auth/loginByEmail`;
export const LoginByPhoneNumberRoute = `${host}/auth/loginByPhoneNumber`;

export const FetchUserContactsRoute = `${host}/auth/fetchUserContacts`;
export const GetUserDataByEmailRoute = `${host}/auth/getUserDataByEmail`;
export const GetUserDataByPhoneNumberRoute = `${host}/auth/getUserDataByPhoneNumber`;

export const GetUserDataByUserIdsRoute = `${host}/auth/getUserDataByUserIds`;
export const TestRoute = `${host}/auth/test`;

export const AddFriendRoute = `${host}/auth/addFriend`;
export const DeleteFriendRoute = `${host}/auth/deleteFriend`;

export const FetchProfileImagesRoute = `${host}/profile/fetchProfileImages`;
export const SetProfileImageRoute = `${host}/profile/setProfileImage`;

export const SendMessageRoute = `${host}/message/sendMessage`;
export const GetAllMessagesRoute = `${host}/message/getAllMessages`;
export const GetMessagesInRangeRoute = `${host}/message/getMessagesInRange`;

export const GetRoomDataOfPersonalRoute = `${host}/room/getRoomDataOfPersonal`;
export const GetRoomDatasOfUserRoute = `${host}/room/getRoomDatasOfUser`;
export const CreateGroupRoomRoute = `${host}/room/createGroupRoom`;
//export const AddUserToGroupRoomRoute = `${host}/room/addUserToGroupRoom`;
export const AddUsersToGroupRoomRoute =`${host}/room/addUsersToGroupRoom`;

export const DeleteUserFromGroupRoomRoute = `${host}/room/deleteUserFromGroupRoom`


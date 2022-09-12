const host = "http://localhost:5000";
export const RegisterRoute = `${host}/auth/register`;
export const LoginRoute = `${host}/auth/login`;
export const FetchUserContactsRoute = `${host}/auth/fetchUserContacts`;
export const GetUserDataByEmailRoute = `${host}/auth/getUserByEmailData`;
export const GetUserDataByUserIdsRoute = `${host}/auth/getUserDataByUserIds`;

export const AddFriendRoute = `${host}/auth/addFriend`;
export const DeleteFriendRoute = `${host}/auth/deleteFriend`;

export const FetchProfileImagesRoute = `${host}/profile/fetchProfileImages`;
export const SetProfileImageRoute = `${host}/profile/setProfileImage`;

export const SendMessageRoute = `${host}/message/sendMessage`;
export const GetAllMessagesRoute = `${host}/message/getAllMessages`;
export const GetMessagesInRangeRoute = `${host}/message/getMessagesInRange`;

export const GetRoomDataOfPersonalRoute = `${host}/room/getRoomDataOfPersonal`;
export const GetRoomDatasOfUser = `${host}/room/getRoomDatasOfUser`;
export const CreateGroupRoomRoute = `${host}/room/createGroupRoom`;

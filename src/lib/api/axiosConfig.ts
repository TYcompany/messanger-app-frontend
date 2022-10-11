import { AxiosRequestConfig } from "axios";
//import { getItem } from "../../lib/localStorageRequest";

export const getConfig = () => {
  // const accessToken = getItem("access-token");

  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Headers": "*",
      //  Authorization: accessToken || "",
      "Access-Control-Allow-Origin": "*",
      withCredentials: true,
      "Access-Control-Allow-Credentials": true,
    },
  };
  return config;
};

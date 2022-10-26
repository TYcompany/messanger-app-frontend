import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { indexedDB } from "./lib/localDatabase/indexedDB";
import { RecoilRoot } from "recoil";
import axios from "axios";
import { Cookies } from "react-cookie";
import { removeAuthData } from "./lib/etc/etcFunctions";
import { refreshAccessToken } from "./lib/api/APIFunctions";

const cookies = new Cookies();

indexedDB();
const access_token = cookies.get("access_token");

axios.defaults.headers.common = {
  "Content-Type": "application/json;charset=utf-8",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Origin": "*",
  withCredentials: true,
  "Access-Control-Allow-Credentials": true,
};

const initialize = async (accessToken: string) => {
  try {
    const newToken = await refreshAccessToken(accessToken);

    axios.defaults.headers.common["Authorization"] = "bearer " + newToken;
  } catch (e) {
    console.log(e);
    removeAuthData();
  }
};

if (!access_token) {
  removeAuthData();
} else {
  initialize(access_token);
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

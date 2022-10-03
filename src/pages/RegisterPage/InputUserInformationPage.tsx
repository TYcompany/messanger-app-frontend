import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import toast, { Toaster } from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { Cookies } from "react-cookie";

import { refreshAccessTokenCookies, registerRequest } from "../../lib/api/APIFunctions";
import { removeAuthData, setAuthData } from "../../lib/etc/etcFunctions";
import { useRecoilState } from "recoil";
import { registerStepState } from "../../store/store";

const cookies = new Cookies();

function InputUserInformationPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useRecoilState(registerStepState);

  const [values, setValues] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
    passwordConfirm: "",
  });

  useEffect(() => {
    const init = async () => {
      await refreshAccessTokenCookies();
      navigate("/chat");
    };

    if (cookies.get("access_token")) {
      init();
    }
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateInputValue()) {
      return;
    }
    const { password, passwordConfirm, userName, email } = values;
    let res;
    try {
      res = await registerRequest({ password, passwordConfirm, userName, email });
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data?.message);
        return;
      }
    }
    if (!res?.data) {
      toast.error("No data recieved from server");
      return;
    }

    const userData = res.data.user;

    const access_token = res.data.access_token;

    setAuthData(userData, access_token);

    toast.success(res.data.message);
    navigate("/setProfile");
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validateInputValue = () => {
    const { password, passwordConfirm, userName, email } = values;
    if (password !== passwordConfirm) {
      toast.error("password and passwordConfirm is not the same!");
      return false;
    }

    if (userName.length < 5) {
      toast.error("userName should longer than 5 characters!");
      return false;
    }
    if (password.length < 8) {
      toast.error("password should longer than 8 cahracters!");
      return false;
    }

    return true;
  };

  return (
    <div>
      {
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="title">
            <img src="" alt="" />
            <h1>Register</h1>
          </div>

          <input type="text" placeholder="Username" name="userName" onChange={(e) => onChange(e)} />
          <input type="text" placeholder="Email" name="email" onChange={(e) => onChange(e)} />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => onChange(e)}
          />
          <input
            type="password"
            placeholder="Password confirm"
            name="passwordConfirm"
            onChange={(e) => onChange(e)}
          />
          <button type="submit">Sign up</button>
          <span>
            Already have an account? <Link to="/login">Login</Link>{" "}
          </span>
        </form>
      }
    </div>
  );
}

export default InputUserInformationPage;

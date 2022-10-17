import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import toast, { Toaster } from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { Cookies } from "react-cookie";

import { refreshAccessTokenCookies, registerRequest } from "../../lib/api/APIFunctions";
import { removeAuthData, setAuthData } from "../../lib/etc/etcFunctions";
import DotsMobileStepper from "./DotsMobileStepper";
import HorizontalLinearStepper from "./HorizontalLinearStepper";
import AuthenticationPage from "./AuthenticationPage";
import InputUserInformationPage from "./InputUserInformationPage";
import { useRecoilState } from "recoil";
import { registerStepState } from "../../store/store";
import SetProfilePage from "../SetProfilePage";

// toast.promise(
//   saveSettings(settings),
//    {
//      loading: 'Saving...',
//      success: <b>Settings saved!</b>,
//      error: <b>Could not save.</b>,
//    }
//  );

// {
//   icon: '👏',
//   style: {
//     borderRadius: '10px',
//     background: '#333',
//     color: '#fff',
//   },
// }

const cookies = new Cookies();

function RegisterPage() {
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
    <>
      <FormContainer>
        {window.innerWidth >= 760 ? (
          <HorizontalLinearStepper></HorizontalLinearStepper>
        ) : (
          <DotsMobileStepper></DotsMobileStepper>
        )}
        {activeStep === 0 && <InputUserInformationPage></InputUserInformationPage>}

        {activeStep === 1 && <AuthenticationPage></AuthenticationPage>}
        {activeStep === 2 && <SetProfilePage></SetProfilePage>}
      </FormContainer>
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  // background-color: #131324;
  /* .title {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
  } */
  /* 
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
    input {
      background-color: transparent;
      padding: 1rem;
      border: 0.1rem solid #4e0eff;
      border-radius: 0.4rem;
      color: white;
      width: 100%;
      font-size: 1rem;
      &:focus {
        border: 0.1rem solid #997af0;
        outline: none;
      }
    }

    button {
      background-color: #997af0;
      color: white;
      padding: 1rem 2rem;
      border: none;
      cursor: pointer;
      border-radius: 0.4rem;
      font-size: 1rem;
      transition: 0.5 ease-in-out;
      &:hover {
        background-color: #4e0eff;
      }
    }

    span {
      color: white;
      a {
        color: #4e0eff;
        font-weight: bold;
      }
    }
  } */
`;

export default RegisterPage;

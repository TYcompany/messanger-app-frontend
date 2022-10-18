import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import toast from "react-hot-toast";
import axios, { Axios, AxiosError } from "axios";
import { Cookies } from "react-cookie";

import {
  loginByEmail,
  loginByPhoneNumber,
  refreshAccessTokenCookies,
} from "../../lib/api/APIFunctions";
import { setAuthData } from "../../lib/etc/etcFunctions";
import { Button, TextField } from "@mui/material";
import CountryCodeSelectInput from "../../components/CountryCodeSelectInput";
import { isValidEmail, isValidPhoneNumber } from "../../lib/etc/validationFunctions";

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

function LoginPage() {
  const navigate = useNavigate();
  const cookies = new Cookies();

  const [loginType, setLoginType] = useState("email");
  const [selectedCountryDial, setSelectedCountryDial] = useState("82");

  const [values, setValues] = useState({
    password: "",
    phoneNumber: "",
    email: "",
  });

  useEffect(() => {
    setValues({
      password: "",
      phoneNumber: "",
      email: "",
    });

    const init = async () => {
      await refreshAccessTokenCookies();
      navigate("/chat");
    };
    if (cookies.get("access_token")) {
      init();
    }
  }, [navigate]);

  const submitLoginByEmail = async () => {
    const { password, email } = values;
    try {
      const res = await loginByEmail(email, password);
      return res;
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data?.message);
        return;
      }
    }
  };
  const submitLoginByPhoneNumber = async () => {
    const { password, phoneNumber } = values;

    try {
      const res = await loginByPhoneNumber(selectedCountryDial + phoneNumber, password);

      return res;
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data?.message);
        return;
      }
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateInputValue()) {
      toast.error("invalid input value!");
      return;
    }

    let res;

    if (loginType === "email") {
      res = await submitLoginByEmail();
    } else if (loginType === "phoneNumber") {
      res = await submitLoginByPhoneNumber();
    }
    console.log(res);

    setAuthData(res?.data?.user, res?.data?.access_token);
    if (!res) {
      toast.error("no data from server!");
      return;
    }

    const userData = res.data.user;
    try {
      const profileImage = await axios.get(userData.profileImageLink, {
        headers: {
          Authorization: "",
        },
      });
      userData.profileImage = profileImage.data;
    } catch (e) {
      console.log(e);
    }
    const access_token = res.data.access_token;

    setAuthData(userData, access_token);
    navigate("/chat");
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validateInputValue = () => {
    const { phoneNumber, email, password } = values;

    if (loginType === "email" && !isValidEmail(email)) {
      //set email error
      return false;
    }
    if (loginType === "phoneNumber" && isValidPhoneNumber(selectedCountryDial + phoneNumber)) {
      // set phoneNumberError
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
        <form className="login-form" onSubmit={(e) => onSubmit(e)}>
          <div className="title">
            <img src="" alt="" />
            <h1>Login</h1>
          </div>
          {loginType === "email" ? (
            <TextField
              className="email-input"
              type="text"
              value={values?.email}
              variant="outlined"
              placeholder="ex) your-email@waicker.com"
              label="Email"
              name="email"
              onChange={(e) => onChange(e)}
            />
          ) : (
            <>
              <CountryCodeSelectInput
                selectedCountryDial={selectedCountryDial}
                setSelectedCountryDial={setSelectedCountryDial}
              />
              <TextField
                type="tel"
                className="phone-number-input"
                label="PhoneNumber"
                variant="outlined"
                value={values?.phoneNumber}
                placeholder="ex) 01039421023"
                name="phoneNumber"
                onChange={(e) => onChange(e)}
              />
            </>
          )}

          {loginType === "email" ? (
            <h3 onClick={() => setLoginType("phoneNumber")}>Login with PhoneNumber</h3>
          ) : (
            <h3 onClick={() => setLoginType("email")}>Login with Email</h3>
          )}
          <TextField
            type="password"
            label="Password"
            placeholder="type-your-password"
            name="password"
            value={values?.password}
            variant="outlined"
            onChange={(e) => onChange(e)}
          />
          <Button type="submit">Login</Button>
          <span>
            Don't have an account? <Link to="/register">Register</Link>{" "}
          </span>
        </form>
      </FormContainer>
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;

  align-items: center;
  //background-color: #131324;
  .title {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .login-form {
    display: flex;
    flex-direction: column;
    border-radius: 2rem;
    padding: 3rem 5rem;

    .phone-number-input {
      width: 300px;
    }
    .email-input {
      width: 300px;
    }
    h3 {
      color: #1976d2;
      cursor: pointer;
      text-align: left;
      padding-left: 1rem;
    }
  }
`;

export default LoginPage;

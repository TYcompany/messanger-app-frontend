import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import toast from "react-hot-toast";
import axios, { Axios, AxiosError } from "axios";
import { Cookies } from "react-cookie";

import { loginRequest, refreshAccessTokenCookies } from "../../lib/api/APIFunctions";
import { setAuthData } from "../../lib/etc/etcFunctions";

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

  const [values, setValues] = useState({
    userName: "",
    password: "",
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
    const { password, userName } = values;
    let res;
    try {
      res = await loginRequest(userName, password);
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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validateInputValue = () => {
    const { userName, password } = values;

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
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="title">
            <img src="" alt="" />
            <h1>Login Page</h1>
          </div>
          {false ? (
            <input type="text" placeholder="Email" name="email" onChange={(e) => onChange(e)} />
          ) : (
            <input
              type="text"
              placeholder="PhonNumber"
              name="phoneNumber"
              onChange={(e) => onChange(e)}
            />
          )}
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => onChange(e)}
          />
          <button type="submit">Login</button>
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
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .title {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
  }

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
  }
`;

export default LoginPage;

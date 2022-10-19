import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { Cookies } from "react-cookie";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import { registerInputValueState, registerStepState } from "../../store/store";
import { TextField, Button } from "@mui/material";

const cookies = new Cookies();

function InputUserInformationPage() {
  const [activeStep, setActiveStep] = useRecoilState(registerStepState);

  const [values, setValues] = useRecoilState(registerInputValueState);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateInputValue()) {
      return;
    }

    setActiveStep(activeStep + 1);
  };
  const validateInputValue = () => {
    const { password, passwordConfirm, userName } = values;
    if (password !== passwordConfirm) {
      toast.error("password and passwordConfirm is not the same!");
      return false;
    }

    if (userName.length < 3) {
      toast.error("Name should longer than 3 characters!");
      return false;
    }
    if (password.length < 8) {
      toast.error("password should longer than 8 cahracters!");
      return false;
    }

    return true;
  };

  return (
    <Container>
      {
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="title">
            <img src="" alt="" />
            <h1>Register</h1>
          </div>

          <TextField
            type="text"
            label="Name"
            placeholder="your name"
            name="userName"
            value={values.userName}
            onChange={(e) => onChange(e)}
          />

          {/* <input type="text" placeholder="Email" name="email" onChange={(e) => onChange(e)} /> */}

          <TextField
            label="password"
            type="password"
            placeholder="Password"
            name="password"
            value={values.password}
            onChange={(e) => onChange(e)}
          />
          <TextField
            label="Password Confirm"
            type="password"
            placeholder="Password confirm"
            name="passwordConfirm"
            value={values.passwordConfirm}
            onChange={(e) => onChange(e)}
          />
          <Button type="submit">Next</Button>
          <span>
            Already have an account? <Link to="/login">Login</Link>{" "}
          </span>
        </form>
      }
    </Container>
  );
}

const Container = styled.div`
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
    //background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
    /* input {
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
    } */

    /* button {
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
    }*/
  }
`;

export default InputUserInformationPage;

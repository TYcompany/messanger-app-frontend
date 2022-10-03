import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { Cookies } from "react-cookie";
import { useRecoilState } from "recoil";
import { registerInputValueState, registerStepState } from "../../store/store";

const cookies = new Cookies();

function InputUserInformationPage() {
  const [activeStep, setActiveStep] = useRecoilState(registerStepState);

  const [values, setValues] = useRecoilState(registerInputValueState);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

          <input
            type="text"
            placeholder="Username"
            name="userName"
            value={values.userName}
            onChange={(e) => onChange(e)}
          />

          {/* <input type="text" placeholder="Email" name="email" onChange={(e) => onChange(e)} /> */}

          <input
            type="password"
            placeholder="Password"
            name="password"
            value={values.password}
            onChange={(e) => onChange(e)}
          />
          <input
            type="password"
            placeholder="Password confirm"
            name="passwordConfirm"
            value={values.passwordConfirm}
            onChange={(e) => onChange(e)}
          />
          <button type="submit">Next</button>
          <span>
            Already have an account? <Link to="/login">Login</Link>{" "}
          </span>
        </form>
      }
    </div>
  );
}

export default InputUserInformationPage;

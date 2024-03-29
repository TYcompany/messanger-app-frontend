import React from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

import { registerInputValueState, registerStepState } from "../../store/store";

import { useEffect, useState } from "react";
import CountryCodeSelectInput from "../../components/CountryCodeSelectInput";
import styled from "styled-components";
import { Button, TextField } from "@mui/material";
import { isValidEmail } from "../../lib/etc/validationFunctions";
import toast from "react-hot-toast";
import {
  registerByEmail,
  registerByPhoneNumber,
  validatePhoneNumber,
} from "../../lib/api/APIFunctions";
import { setAuthData } from "../../lib/etc/etcFunctions";
import { AxiosError } from "axios";

function AuthenticationPage() {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useRecoilState(registerStepState);
  const [values, setValues] = useRecoilState(registerInputValueState);

  const [phoneNumberConfirmToken, setPhoneNumberConfirmToken] = useState("");
  //email or phone
  const [authType, setAuthType] = useState("email");

  const [email, setEmail] = useState("");
  const [selectedCountryDial, setSelectedCountryDial] = React.useState("82");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [pendingValidationCode, setPendingValidationCode] = useState(true);

  const onSubmitPhoneNumber = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { userName, password } = values;

    const userPhoneNumber = selectedCountryDial + phoneNumber;

    try {
      const res = await registerByPhoneNumber({ phoneNumber: userPhoneNumber, userName, password });
      toast(res.data.message);
    } catch (e) {
      console.log(e);
      if (e instanceof AxiosError) {
        if (e?.response?.data.statusCode === 409) {
          toast.error("Account already exists with such phoneNumber!");
        }
      }
      return;
    }
    toast.success("Sent a varification code message");
    setPendingValidationCode(true);
  };

  const phoneNumberValidation = async () => {
    const userPhoneNumber = selectedCountryDial + phoneNumber;
    try {
      const res = await validatePhoneNumber({
        phoneNumber: userPhoneNumber,
        phoneNumberConfirmToken,
      });

      if (res.data.message) {
        toast.success(res.data.message);
      }

      const userData = res.data.user;

      const access_token = res.data.access_token;

      await setAuthData(userData, access_token);

      setActiveStep(activeStep + 1);
    } catch (e) {
      console.log(e);
      toast.error("PhoneNumber validation failed!");
    }
  };

  const onSubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { userName, password } = values;

    if (!isValidEmail(email)) {
      toast.error("please type valid email!");
      return;
    }

    try {
      await registerByEmail({ userName, password, email });
    } catch (e) {
      console.log(e);
      if (e instanceof AxiosError) {
        if (e?.response?.data.statusCode === 409) {
          toast.error("Account already exists with such email!");
        }
      }
      return;
    }
    toast.success("Sent you an validation code. Please check your email");
  };

  return (
    <Container>
      <h1>Authentication</h1>
      {authType === "email" ? (
        <form onSubmit={(e) => onSubmitEmail(e)}>
          <div className="email-input-container">
            <TextField
              label="Email"
              variant="outlined"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="email-input"
              placeholder="ex) your-email@waicker.com"
            />
            <Button type="submit" className="send-email-button">
              Send
            </Button>
          </div>
          <h3 onClick={() => setAuthType("phone")}>Want to authenticate with phoneNumber?</h3>
        </form>
      ) : (
        <form onSubmit={(e) => onSubmitPhoneNumber(e)}>
          <div className="phone-number-input-container">
            <CountryCodeSelectInput
              selectedCountryDial={selectedCountryDial}
              setSelectedCountryDial={setSelectedCountryDial}
            />
            <TextField
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="phone-number"
              type="text"
              placeholder="ex) 01012345678"
            ></TextField>
            <Button className="send-validation-code-button" type="submit">
              Send
            </Button>
          </div>

          {pendingValidationCode && (
            <div className="validation-code-input-container">
              <TextField
                value={phoneNumberConfirmToken}
                onChange={(e) => setPhoneNumberConfirmToken(e.target.value)}
                placeholder="ex) 673451"
                className="validation-code-input"
              ></TextField>
              <Button
                className="validation-code-confirm-button"
                onClick={() => phoneNumberValidation()}
              >
                Confirm
              </Button>
            </div>
          )}
          <h3 onClick={() => setAuthType("email")}>Want to authenticate with email?</h3>
        </form>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: white;

  .email-input-container {
    gap: 0.5rem;
    display: flex;
    flex-direction: row;
    .email-input {
      font-size: 1.3rem;
      width: 300px;
    }
    .send-email-button {
      font-size: 1.3rem;
    }
  }

  .phone-number-input-container {
    display: flex;
    flex-direction: row;
    margin-bottom: 2rem;
    align-items: center;
    justify-content: flex-start;
    margin: 1rem;
    gap: 0.5rem;
    .phone-number {
      width: 300px;
    }
    .send-validation-code-button {
      font-size: 1.3rem;
    }
    @media screen and (max-width: 760px) {
      flex-direction: column;
    }
  }
  .validation-code-input-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 1rem;
    margin: 1rem;
    .validation-code-input {
    }
    .validation-code-confirm-button {
    }
  }
  h3 {
    color: #1976d2;
    cursor: pointer;
  }
`;

export default AuthenticationPage;

import React from "react";
import { useRecoilState } from "recoil";
import { registerStepState } from "../../store/store";
import axios from "axios";
import { useEffect, useState } from "react";
import CountryCodeSelectInput from "./CountryCodeSelectInput";
import styled from "styled-components";
import { Button, TextField } from "@mui/material";
import { isValidEmail } from "../../lib/etc/validationFunctions";
import toast from "react-hot-toast";

function AuthenticationPage() {
  const [activeStep, setActiveStep] = useRecoilState(registerStepState);

  //email or phone
  const [authType, setAuthType] = useState("email");

  const [email, setEmail] = useState("");
  const [selectedCountryDial, setSelectedCountryDial] = React.useState("82");
  const [phoneNumber, setPhoneNumber] = useState("");

  const onSubmitPhoneNumber = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userPhoneNumber = selectedCountryDial + phoneNumber;
    console.log("auth with phonenumber");
    //auth with phone
  };

  const onSubmitEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("auth with email", email);

    if (!isValidEmail(email)) {
      toast.error("please type valid email!");
      return;
    }

    //submit
    //auth with email
  };

  return (
    <Container>
      <h1>AuthenticationPage</h1>
      {authType === "email" ? (
        <form onSubmit={(e) => onSubmitEmail(e)}>
          <TextField
            label="Email"
            variant="outlined"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <h3 onClick={() => setAuthType("phone")}>Want to authenticate with phoneNumber?</h3>
          <Button type="submit">Send</Button>
        </form>
      ) : (
        <form onSubmit={(e) => onSubmitPhoneNumber(e)}>
          <div className="phone-number-input-container">
            <CountryCodeSelectInput
              selectedCountryDial={selectedCountryDial}
              setSelectedCountryDial={setSelectedCountryDial}
            />
            <input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="phone-number"
              type="text"
              placeholder="ex) 01012345678"
            ></input>
          </div>
          <h3 onClick={() => setAuthType("email")}>Want to authenticate with email?</h3>
          <Button type="submit">Send</Button>
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

  .phone-number-input-container {
    display: flex;
    flex-direction: row;
  }
  h3 {
    color: #1976d2;
    cursor: pointer;
  }
`;

export default AuthenticationPage;

import React from "react";
import { useRecoilState } from "recoil";
import { registerStepState } from "../../store/store";
import axios from "axios";
import { useEffect, useState } from "react";
import CountryCodeSelectInput from "./CountryCodeSelectInput";
import styled from "styled-components";
import { Button } from "@mui/material";

function AuthenticationPage() {
  const [activeStep, setActiveStep] = useRecoilState(registerStepState);

  //email or phone
  const [authType, setAuthType] = useState("email");

  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <Container>
      <h1>AuthenticationPage</h1>
      {authType === "email" ? (
        <div>
          email
          <input></input>
          <h3 onClick={() => setAuthType("phone")}>Want to authenticate with phoneNumber?</h3>
        </div>
      ) : (
        <div>
          phoneNumber
          <div className="phone-number-input-container">
            <CountryCodeSelectInput></CountryCodeSelectInput>
            <input type="text" placeholder="ex)01012345678"></input>
          </div>
          <h3 onClick={() => setAuthType("email")}>Want to authenticate with email?</h3>
        </div>
      )}
      <Button>Send</Button>
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

import React from "react";
import { useRecoilState } from "recoil";
import { registerStepState } from "../../store/store";
import axios from "axios";
import { useEffect, useState } from "react";

function AuthenticationPage() {
  const [activeStep, setActiveStep] = useRecoilState(registerStepState);

  const [phoneNumber, setPhoneNumber] = useState("");
  // const handlePhoneChange = (
  //   isValid: boolean,
  //   value: string,
  //   selectedCountryData: CountryData,
  //   fullNumber: string,
  //   extension: string
  // ) => {
  //   setPhoneNumber(fullNumber);
  // };
  //authenticate

  return (
    <div style={{ color: "white" }}>
      AuthenticationPage
      <div>email</div>
      <div>phoneNumber</div>
      {/* <IntlTelInput
        containerClassName="intl-tel-input"
        inputClassName="form-control"
        value={phoneNumber}
        onPhoneNumberChange={handlePhoneChange}
        defaultCountry={"kr"}
      /> */}
    </div>
  );
}

export default AuthenticationPage;

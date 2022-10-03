import axios from "axios";
import { useEffect, useState } from "react";
import IntlTelInput, { CountryData } from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";

function MainPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const handlePhoneChange = (
    isValid: boolean,
    value: string,
    selectedCountryData: CountryData,
    fullNumber: string,
    extension: string
  ) => {
    setPhoneNumber(fullNumber);
  };

  return (
    <div>
      <h1> Waicker</h1>
      What an interesting conversation!
      <IntlTelInput
        containerClassName="intl-tel-input"
        inputClassName="form-control"
        value={phoneNumber}
        onPhoneNumberChange={handlePhoneChange}
        defaultCountry={"kr"}
      />
    </div>
  );
}

export default MainPage;

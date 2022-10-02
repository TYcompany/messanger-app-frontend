import { useState } from "react";
import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";

function MainPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const handlePhoneChange = (status: any, pn: any, country: any) => {
    console.log(status, pn, country);
    setPhoneNumber(pn)
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
      />
    </div>
  );
}

export default MainPage;

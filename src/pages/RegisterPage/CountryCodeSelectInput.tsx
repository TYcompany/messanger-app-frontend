import React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import styled from "styled-components";

import { CountryData } from "../../metaData/CountryData";

function CountryCodeSelectInput() {
  const [selectCountryCode, setSelectCountryCode] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectCountryCode(event.target.value as string);
  };

  return (
    <Container>
      <FormControl fullWidth className="form-control">
        <InputLabel className="select-label">Country</InputLabel>
        <Select
          className="select"
          value={selectCountryCode}
          label="Country"
          onChange={handleChange}
        >
          {CountryData.map((countryData) => (
            <MenuItem key={countryData[0] + "-item"} value={countryData[1]}>
              {countryData[0] + " " + countryData[2]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Container>
  );
}

const Container = styled.div`
  width: 10rem;

  .form-control {
    .select {
    }
  }
`;

export default CountryCodeSelectInput;

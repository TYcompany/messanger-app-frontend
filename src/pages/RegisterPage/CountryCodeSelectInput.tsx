import * as React from "react";
import styled from "styled-components";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { countryDatas, CountryType } from "../../metaData/CountryData";

function CountryCodeSelectInput() {
  const [selectedCountryDial, setSelectedCountryDial] = React.useState("82");

  const handleChange = (e: React.SyntheticEvent<Element, Event>, country: CountryType | null) => {
    if (!country) {
      return;
    }
    setSelectedCountryDial(country.phone);
  };
  console.log();

  React.useEffect(() => {
    console.log(selectedCountryDial);
  }, [selectedCountryDial]);

  return (
    <Autocomplete
      id="country-select-demo"
      sx={{ width: 300 }}
      options={countryDatas}
      autoHighlight
      getOptionLabel={(option) => option.label + " +" + option.phone}
      onChange={(e, value) => handleChange(e, value)}
      renderOption={(props, option) => (
        <Box component="li" sx={{ "& > img": { mr: 2, flexShrink: 0 } }} {...props}>
          <img
            loading="lazy"
            width="20"
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            alt=""
          />
          {option.label} ({option.code}) +{option.phone}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose your country"
          autoFocus={true}
          inputProps={{
            ...params.inputProps,
            //autoComplete: "new-password", // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}

const Container = styled.div`
  width: 10rem;

  .form-control {
    .select {
      text-align: left;
    }
  }
`;

export default CountryCodeSelectInput;

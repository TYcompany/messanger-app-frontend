import * as React from "react";
import styled from "styled-components";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { countryDatas, CountryType } from "../metaData/CountryData";

function CountryCodeSelectInput({
  selectedCountryDial,
  setSelectedCountryDial,
}: {
  selectedCountryDial: string;
  setSelectedCountryDial: Function;
}) {
  const handleChange = (e: React.SyntheticEvent<Element, Event>, country: CountryType | null) => {
    if (!country) {
      return;
    }
    setSelectedCountryDial(country.phone);
  };

  return (
    <Container>
      <Autocomplete
        id="country-select-demo"
        sx={{ width: 300 }}
        options={countryDatas}
        autoHighlight
        getOptionLabel={(option) => option.label + " +" + option.phone}
        onChange={(e, value) => handleChange(e, value)}
        defaultValue={countryDatas[120]}
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
            label="Country Code"
            autoFocus={true}
            inputProps={{
              ...params.inputProps,
              autoComplete: "new-password", // disable autocomplete and autofill
            }}
          />
        )}
      />
    </Container>
  );
}

const Container = styled.div`
  .form-control {
    .select {
      text-align: left;
    }
  }
`;

export default CountryCodeSelectInput;

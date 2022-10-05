import * as React from "react";
import styled from "styled-components";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { countryDatas } from "../../metaData/CountryData";

function CountryCodeSelectInput() {
  return (
    <Autocomplete
      id="country-select-demo"
      sx={{ width: 300 }}
      options={countryDatas}
      autoHighlight
      getOptionLabel={(option) => option.label}
      renderOption={(props, option) => (
        <Box component="li" sx={{ "& > img": { mr: 2, flexShrink: 0 } }} {...props}>
          <img
            loading="lazy"
            width="20"
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
            alt=""
          />
          {countryDatas.label} ({countryDatas.code}) +{countryDatas.phone}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a country"
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password", // disable autocomplete and autofill
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

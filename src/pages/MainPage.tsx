import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { testRequest } from "../lib/api/APIFunctions";
import { currentUserState } from "../store/store";

function MainPage() {
  const [imageString, setImageString] = useState("");
 
  const reader = new FileReader();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();

    if (!e?.target.files?.[0]) {
      return;
    }
    const fileSize = e.target.files?.[0].size / 1024 / 1024; // in MiB
    if (fileSize > 2) {
      alert("File size exceeds 2 MiB!");
      return;
    }
    reader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    reader.onload = async function (evt: any) {
      if (evt.target.readyState != 2) return;
      if (evt.target.error) {
        alert("Error while reading file!");
        return;
      }

      const filecontent = evt.target.result;

      setImageString(filecontent);
    };
  }, []);
  
  return (
    <div>
      {imageString && <img width="450px" alt="sample" src={imageString}></img>}
      <input type="file" accept="image/*" onChange={(e) => onChange(e)}></input>
      
    </div>
  );
}

export default MainPage;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { testRequest } from "../lib/api/APIFunctions";

function MainPage() {
  const [imageString, setImageString] = useState("");

  const reader = new FileReader();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();

    if (!e?.target.files?.[0]) {
      return;
    }
    reader.readAsDataURL(e?.target.files[0]);
  };

  useEffect(() => {
    reader.onload = async function (evt: any) {
      console.log("upload started");

      if (evt.target.readyState != 2) return;
      if (evt.target.error) {
        alert("Error while reading file");
        return;
      }

      const filecontent = evt.target.result;
      setImageString(filecontent);

      console.log("upload finished");
      const res = await testRequest(filecontent);
      console.log(res);
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

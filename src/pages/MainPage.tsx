import axios from "axios";
import React, { useEffect, useState } from "react";
import { testRequest } from "../lib/api/APIFunctions";

function MainPage() {
  const [uploadedImage, setUploadedImage] = useState<any>(null);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();

    if (!e?.target.files?.[0]) {
      return;
    }

    setUploadedImage(e?.target?.files?.[0]);
  };

  useEffect(() => {
    if (!uploadedImage) {
      return;
    }

    const testImageUpload = async () => {
      const formData = new FormData();

      formData.append("file_to_upload", uploadedImage, uploadedImage.name);

      const res = await testRequest(formData);
    };
    testImageUpload();
  }, [uploadedImage]);

  return (
    <div>
      {uploadedImage && (
        <img width="450px" alt="sample" src={URL.createObjectURL(uploadedImage || "")}></img>
      )}
      <input type="file" accept="image/*" onChange={(e) => onChange(e)}></input>
    </div>
  );
}

export default MainPage;

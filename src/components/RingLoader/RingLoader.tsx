import React from "react";
import "./RingLoader.scss";
function RingLoader() {
  return (
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export default RingLoader;

import React, { useState } from "react";

export const Barrage = () => {
  const [timeStringArray, setTimeStringArray] = useState([]);
  const addTimeString = () => {
    setTimeStringArray((d) => {
      return [...d, new Date().toTimeString()];
    });
  };
  return (
    <div>
      Hello、barrage Page
      <button onClick={addTimeString}>添加</button>
      <ul>
        {timeStringArray.map((s) => {
          return <li>{s}</li>;
        })}
      </ul>
    </div>
  );
};

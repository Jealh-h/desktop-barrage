import React, { useState } from "react";
import {
  IPC_EVENT_CHANNEL_NAME,
  MAIN_THREAD_FORWARD_EVENT,
} from "../../constants";

export const Barrage = () => {
  const [timeStringArray, setTimeStringArray] = useState([]);
  const addTimeString = () => {
    setTimeStringArray((d) => {
      return [...d, new Date().toTimeString()];
    });
  };

  React.useEffect(() => {
    window?.electron?.notificationApi?.onMessage(
      MAIN_THREAD_FORWARD_EVENT.ADD_BARRAGE,
      (s: string) => {
        addTimeString();
      }
    );
  }, []);

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

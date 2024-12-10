import React, { useState } from "react";
import {
  IPC_EVENT_CHANNEL_NAME,
  MAIN_THREAD_FORWARD_EVENT,
} from "../../constants";
import styles from "./index.module.css";

export const Barrage = () => {
  const [timeStringArray, setTimeStringArray] = useState([]);
  const addTimeString = (msg: string) => {
    setTimeStringArray((d) => {
      console.log([...d, msg]);
      return [...d, msg];
    });
  };

  React.useEffect(() => {
    window?.electron?.notificationApi?.onMessage(
      MAIN_THREAD_FORWARD_EVENT.ADD_BARRAGE,
      (data: Record<string, any>) => {
        const { msg } = data;
        addTimeString(msg);
        console.log("receive:", data);
      }
    );
  }, []);

  return (
    <div className={styles.danmuWrapper}>
      Hello、barrage Page
      {timeStringArray.map((s) => {
        return (
          <div className={`${styles.danmuItem} ${styles.danmuItemAnimation}`}>
            {s}
          </div>
        );
      })}
    </div>
  );
};

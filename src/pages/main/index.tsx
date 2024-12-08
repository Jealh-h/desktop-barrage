import React from "react";
// import { ipcRenderer } from "electron";
import styles from "./index.module.css";
import {
  IPC_EVENT_CHANNEL_NAME,
  MAIN_THREAD_FORWARD_EVENT,
} from "../../constants";

export const Main = () => {
  const sendAddBarrageEvent = () => {
    // ipcRenderer.send(
    //   IPC_EVENT_CHANNEL_NAME.ADD_BARRAGE_TO_BARRAGE_WINDOW,
    //   "params_1"
    // );
    console.log("send>>>");
    window?.electron?.notificationApi?.sendMessage(
      IPC_EVENT_CHANNEL_NAME.ADD_BARRAGE_TO_BARRAGE_WINDOW,
      "123"
    );
  };

  return (
    <div className={styles.title}>
      hello、React +
      <div
        onClick={() => {
          sendAddBarrageEvent();
        }}
      >
        发送
      </div>
    </div>
  );
};

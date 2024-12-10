import React from "react";
// import { ipcRenderer } from "electron";
import styles from "./index.module.css";
import {
  IPC_EVENT_CHANNEL_NAME,
  MAIN_THREAD_FORWARD_EVENT,
} from "../../constants";

export const Main = () => {
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const sendAddBarrageEvent = () => {
    const text = inputRef.current?.value?.trim();
    if (!text) return;
    window?.electron?.notificationApi?.sendMessage(
      IPC_EVENT_CHANNEL_NAME.ADD_BARRAGE_TO_BARRAGE_WINDOW,
      {
        msg: text,
      }
    );
    inputRef.current.value = "";
  };

  return (
    <div className={styles.title}>
      <div className={styles.compactWrapper}>
        <input ref={inputRef} className={styles.input} type="text" />
        <button className={styles.btn} onMouseUp={sendAddBarrageEvent}>
          发送
        </button>
      </div>
    </div>
  );
};

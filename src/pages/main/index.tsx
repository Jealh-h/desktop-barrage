import React from "react";
// import { ipcRenderer } from "electron";
import styles from "./index.module.css";
import {
  IPC_EVENT_CHANNEL_NAME,
  MAIN_THREAD_FORWARD_EVENT,
} from "../../constants";

const fontSizeOption = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36];
const fontWeightOption = ["normal", "bold", "bolder"];

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
        <input
          ref={inputRef}
          className={styles.input}
          placeholder="发个弹幕试一试吧"
          type="text"
        />
        <button className={styles.btn} onMouseUp={sendAddBarrageEvent}>
          发送
        </button>
      </div>
      <div className={styles.styleConfigWrapper}>
        <form action="" className={styles.formWrapper}>
          <div className={styles.formItem}>
            <label htmlFor="fontSize">字体大小：</label>
            <select name="fontSize">
              {fontSizeOption.map((size) => {
                return <option value={size}>{size}</option>;
              })}
            </select>
          </div>
          <div className={styles.formItem}>
            <label htmlFor="color">字体颜色：</label>
            <input name="color" type="color" />
          </div>
          <div className={styles.formItem}>
            <label htmlFor="fontWeight">字体粗细：</label>
            <select name="fontWeight">
              {fontWeightOption.map((fontWeight) => {
                return <option value={fontWeight}>{fontWeight}</option>;
              })}
            </select>
          </div>
        </form>
      </div>
    </div>
  );
};

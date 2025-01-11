import React from "react";
import styles from "./index.module.css";
import { IPC_EVENT_CHANNEL_NAME } from "../../constants";

const fontSizeOption = [
  "10px",
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "22px",
  "24px",
  "26px",
  "28px",
  "30px",
  "32px",
  "34px",
  "36px",
];
const fontWeightOption = ["normal", "bold", "bolder"];

export const Main = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const sendAddBarrageEvent = () => {
    const text = inputRef.current?.value?.trim();
    if (!text) return;
    window?.electron?.notificationApi?.sendMessage(
      IPC_EVENT_CHANNEL_NAME.ADD_BARRAGE_TO_BARRAGE_WINDOW,
      {
        msg: text,
        style: getAllValue(),
      }
    );
    inputRef.current.value = "";
  };

  const getAllValue = () => {
    const elements = formRef.current;
    const value: Record<string, unknown> = {};
    for (let el of elements) {
      // @ts-ignore
      value[el.name] = el.value;
    }
    return value;
  };

  return (
    <div className={styles.title}>
      <div className={styles.compactWrapper}>
        <input
          ref={inputRef}
          autoFocus
          className={styles.input}
          placeholder="发个弹幕试一试吧"
          type="text"
        />
        <button className={styles.btn} onMouseUp={sendAddBarrageEvent}>
          发送
        </button>
      </div>
      <div className={styles.styleConfigWrapper}>
        <form
          onChange={(e) => {
            console.log(e);
          }}
          action=""
          ref={formRef}
          className={styles.formWrapper}
        >
          <div className={styles.formItem}>
            <label htmlFor="fontSize">
              字体大小：
              <select name="fontSize">
                {fontSizeOption.map((size) => {
                  return (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
          <div className={styles.formItem}>
            <label htmlFor="color">
              字体颜色：
              <input name="color" type="color" />
            </label>
          </div>
          <div className={styles.formItem}>
            <label htmlFor="fontWeight">
              字体粗细：
              <select name="fontWeight">
                {fontWeightOption.map((fontWeight) => {
                  return (
                    <option key={fontWeight} value={fontWeight}>
                      {fontWeight}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
        </form>
      </div>
    </div>
  );
};

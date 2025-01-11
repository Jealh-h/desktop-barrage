import React, { useRef } from "react";
import { MAIN_THREAD_FORWARD_EVENT } from "../../constants";
import styles from "./index.module.css";
import { BarrageComponent, BarrageComponentRef } from "./components/barrage";

export const Barrage = () => {
  const barrageRef = useRef<BarrageComponentRef>();

  React.useEffect(() => {
    window?.electron?.notificationApi?.onMessage(
      MAIN_THREAD_FORWARD_EVENT.ADD_BARRAGE,
      (data: Record<string, any>) => {
        const { msg, style } = data;
        barrageRef.current?.addBarrage(msg, style);
      }
    );
  }, []);

  return (
    <div className={styles.danmuWrapper}>
      <BarrageComponent ref={barrageRef} />
    </div>
  );
};

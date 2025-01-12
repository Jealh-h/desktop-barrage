import React, {
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "./index.css";

class EventEmitter {
  private eventMap: Record<string, Array<Function>> = {};
  constructor() {}

  on(eventName: string, callback: Function) {
    if (!this.eventMap[eventName]) {
      this.eventMap[eventName] = [callback];
    } else {
      this.eventMap[eventName].push(callback);
    }
  }

  emit(eventName: string) {
    if (!this.eventMap[eventName]) return;
    else {
      this.eventMap[eventName].forEach((cb) => cb());
    }
  }

  off(eventName: string) {
    if (this.eventMap[eventName]) {
      delete this.eventMap[eventName];
    }
  }
}

enum BarrageItemEventEnum {
  /** 完全进入屏幕 */
  ENTERED = "ENTERED",
  /** 完全消失于屏幕 */
  DISAPPEAR = "DISPAAEAR",
}

type CustomStyle = React.CSSProperties & { [key: string]: unknown };

interface IBarrageItemConfig {
  msg: ReactNode;
  style?: CustomStyle;
}

export const DEFAULT_FONT_SIZE = 16;

class BarrageItem extends EventEmitter {
  public barrageConfig: IBarrageItemConfig;
  public key: string;
  /** 是否在屏幕中 */
  private active: boolean;
  constructor(config: IBarrageItemConfig) {
    super();
    this.barrageConfig = config;
    // 以创建时间为 key
    this.key = `${new Date().valueOf()}_${Math.random()}`;
  }

  updateStyle(newStyle: CustomStyle = {}) {
    this.barrageConfig.style = {
      ...(this.barrageConfig.style || {}),
      ...newStyle,
    };
  }

  calcTopOffset() {
    // calcTopOffset(offsetProportion: number) {
    // const { fontSize = DEFAULT_FONT_SIZE } = this.barrageConfig.style || {};
    const windowHeight = window.innerHeight;
    this.updateStyle({
      ["--offsetTop"]: Math.random() * windowHeight + "px",
    });
  }

  start() {}

  update() {
    // 计算位移
  }
}

class BarrageManager extends EventEmitter {
  private barrageQueue: Array<BarrageItem>;
  // TODO:
  // 1. 添加连续模式，一个队列出完后在出另一个
  // 2. 非连续模式，一直出弹幕，需要控制弹幕重叠等
  // 3. 冲锋弹幕
  // 4. 空屏判断 --- queue 中每一个都不是 active
  constructor() {
    super();
    this.barrageQueue = [];
  }

  get queue() {
    return this.barrageQueue;
  }

  pushBarrage(barrageItem: BarrageItem) {
    this.barrageQueue.push(barrageItem);
  }

  popBarrage() {
    if (this.barrageQueue.length) return this.barrageQueue.pop();
  }

  shiftBarrage() {
    if (this.barrageQueue.length) return this.barrageQueue.shift();
  }

  startQueue() {
    // 没有弹幕则直接退出
    if (!this.barrageQueue.length) return;
    const barrageItem = this.shiftBarrage();
    barrageItem.start();
    barrageItem.on(BarrageItemEventEnum.ENTERED, () => {
      this.startQueue();
    });
  }

  removeBarrageItem(barrageItem: BarrageItem) {
    this.barrageQueue = this.barrageQueue.filter((item) => {
      item.key != barrageItem.key;
    });
  }
}

export const useBarrage = () => {
  const currentBarrageManagerRef = useRef(new BarrageManager());
  const [barrageList, setBarrageList] = useState<Array<BarrageItem>>([]);
  const currentBarrageManager = currentBarrageManagerRef.current;
  const offsetProportion = useRef<number>(0);
  const timer = useRef<NodeJS.Timeout>();

  function addBarrage(barrage: BarrageItem) {
    // 注册完成事件
    barrage.on(BarrageItemEventEnum.DISAPPEAR, () => {
      // 只能用回调获取最新的 barrageList
      setBarrageList((_barrageList) =>
        _barrageList.filter((item) => item.key !== barrage.key)
      );
    });

    // 添加 manager 队列
    currentBarrageManager.pushBarrage(barrage);

    // 开始动画
    pop();
  }

  function pop() {
    const barrageItem = currentBarrageManager.shiftBarrage();
    if (barrageItem) {
      // barrageItem.calcTopOffset(offsetProportion.current);
      barrageItem.calcTopOffset();
      if (!timer.current) {
        // 间隔一秒复位
        offsetProportion.current += 1;
        timer.current = setTimeout(() => {
          offsetProportion.current -= 1;
          timer.current = null;
        }, 2000);
      }

      setBarrageList((pre) => [...pre, barrageItem]);
    }
  }

  return {
    barrageList,
    addBarrage,
    start: pop,
  };
};

const BarrageItemComp: React.FC<{ barrageItem: BarrageItem }> = (props) => {
  const { barrageItem } = props;
  const textDom = useRef<HTMLDivElement>();
  const [style, setStyle] = useState<CustomStyle>({
    ...(barrageItem.barrageConfig.style || {}),
  });

  const calcElePos = () => {
    const textNode = textDom.current;
    const nodeWidth = textNode.clientWidth;
    const windowWidth = window.innerWidth;
    const offsetWidth = nodeWidth + windowWidth + "px";

    // 起点位置
    const start = {
      ["--offset"]: offsetWidth,
    };
    // 终止位置
    const end = {
      ["--translateX"]: -(windowWidth + nodeWidth * 2) + "px",
    };

    setStyle({
      ...style,
      ...start,
      ...end,
    });
  };

  useEffect(() => {
    calcElePos();
  }, []);

  const onAnimationEnd = () => {
    barrageItem.emit(BarrageItemEventEnum.DISAPPEAR);
  };

  const toggleAnimation = () => {
    textDom.current.classList.toggle("roll-animation-paused");
  };

  return (
    <div
      ref={textDom}
      onAnimationEnd={onAnimationEnd}
      onMouseEnter={toggleAnimation}
      onMouseLeave={toggleAnimation}
      className="barrage-item"
      style={style}
    >
      {barrageItem.barrageConfig.msg}
    </div>
  );
};

export interface BarrageComponentRef {
  addBarrage: (msg: string, style: CustomStyle) => void;
}

export const BarrageComponent = React.forwardRef((_p, ref) => {
  const { barrageList, addBarrage } = useBarrage();

  const innerAddBarrage = (msg: string, style: CustomStyle) => {
    addBarrage(
      new BarrageItem({
        msg,
        style,
      })
    );
  };

  useImperativeHandle(
    ref,
    () => ({
      addBarrage: innerAddBarrage,
    }),
    []
  );

  return (
    <div className="barrage-wrapper">
      {barrageList.map((item) => {
        return (
          <BarrageItemComp key={item.key} barrageItem={item}></BarrageItemComp>
        );
      })}
    </div>
  );
});

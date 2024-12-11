import React, { ReactNode } from "react";

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

interface IBarrageItemConfig {
  msg: ReactNode;
  style?: React.CSSProperties;
}

class BarrageItem extends EventEmitter {
  private barrageConfig: IBarrageItemConfig;
  /** 是否在屏幕中 */
  private active: boolean;
  constructor(config: IBarrageItemConfig) {
    super();
    this.barrageConfig = config;
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

  pushBarrage(barrageItem: BarrageItem) {
    this.barrageQueue.push(barrageItem);
  }

  popBarrage() {
    return this.barrageQueue.pop();
  }

  shiftBarrage() {
    return this.barrageQueue.shift();
  }

  startQueue() {
    // 没有弹幕则直接退出
    if (!this.barrageQueue.length) return;
    const barrageItem = this.shiftBarrage();
    barrageItem.start();
    barrageItem.on("end", () => {
      this.startQueue();
    });
  }
}

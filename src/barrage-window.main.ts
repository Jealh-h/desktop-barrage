import { app, BrowserWindow, screen, ipcMain } from "electron";
import * as path from "path";

/**
 * 创建透明窗口
 */
export function createTransparentWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // 透明窗口设置
  const transparentWindow = new BrowserWindow({
    width: width, // 设置窗口为全屏宽度
    height: height, // 设置窗口为全屏高度
    frame: false, // 无边框
    transparent: true, // 透明背景
    alwaysOnTop: true, // 始终在最上层
    skipTaskbar: true, // 不显示在任务栏中
    webPreferences: {
      nodeIntegration: true,
    },
    resizable: false, // 禁止窗口大小调整
  });

  // 加载透明窗口 HTML 文件
  transparentWindow.loadFile("index.barrage.html");

  // 监听关闭事件
  transparentWindow.on("closed", () => {
    transparentWindow.destroy();
  });

  // 使透明窗口支持点击穿透，即允许用户操作下方的窗口
  transparentWindow.setIgnoreMouseEvents(true); // 禁用鼠标事件
}

import { app, BrowserWindow, globalShortcut, dialog } from "electron";
import path from "path";
import started from "electron-squirrel-startup";
import IpcController from "./common/ipcMain";
import { createTransparentWindow } from "./barrage-window.main";
import { IPC_EVENT_CHANNEL_NAME, MAIN_THREAD_FORWARD_EVENT } from "./constants";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 500,
    height: 300,
    // frame: false, // 无边框
    // resizable: false,
    // transparent: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // registry keyboard event
  // 注册全局快捷键: Alt + Space
  globalShortcut.register("Alt+Space", () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide(); // 隐藏窗口
    } else {
      mainWindow.show(); // 显示窗口
      mainWindow.webContents.send("focus-input"); // 向渲染进程发送消息，触发输入框聚焦
    }
  });

  return mainWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  const transparentWindow = createTransparentWindow();
  const mainWindow = createWindow();

  // 发送给 barrage 窗口，添加弹幕
  IpcController.registry(
    IPC_EVENT_CHANNEL_NAME.ADD_BARRAGE_TO_BARRAGE_WINDOW,
    (_, d) => {
      // // 弹出消息提示框
      // dialog
      //   .showMessageBox(mainWindow, {
      //     type: "info",
      //     title: "提示",
      //     message: "这是一个消息提示框",
      //     buttons: ["确定", "取消"],
      //   })
      //   .then((result) => {
      //     console.log("用户选择:", result.response); // 0 表示第一个按钮，1 表示第二个按钮
      //   });
      transparentWindow.webContents.send(
        MAIN_THREAD_FORWARD_EVENT.ADD_BARRAGE,
        d
      );
    }
  );

  // 发送给主窗口，通知添加弹幕完成
  // IpcController.registry(
  //   IPC_EVENT_CHANNEL_NAME.ADD_BARRAGE_TO_BARRAGE_WINDOW,
  //   (_, d) => {
  //     mainWindow.webContents.send(
  //       MAIN_THREAD_FORWARD_EVENT.COMPLETE_BARRAGE_ADD,
  //       d
  //     );
  //   }
  // );
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
    createTransparentWindow();
  }
});

app.on("will-quit", () => {
  // 注销全局快捷键
  globalShortcut.unregisterAll();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { ipcRenderer, contextBridge } from "electron";
import * as path from "path";

contextBridge.exposeInMainWorld("electron", {
  notificationApi: {
    onMessage: (channel: string, callback: Function) => {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    },
    sendMessage: (channel: string, data: any) => {
      ipcRenderer.send(channel, data);
    },
  },
});

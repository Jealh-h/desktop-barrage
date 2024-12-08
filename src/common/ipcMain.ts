import { ipcMain } from "electron";

class IpcController {
  private static instance: IpcController = null;
  constructor() {}

  public static getInstance() {
    if (!IpcController.instance) {
      IpcController.instance = new IpcController();
    }
    return IpcController.instance;
  }

  registry(
    eventName: string,
    callback: (e: unknown, ...args: unknown[]) => void
  ) {
    ipcMain.on(eventName, callback);
  }

  unregistry(eventName: string, handler: () => void) {
    ipcMain.removeListener(eventName, handler);
  }
}
export default IpcController.getInstance();

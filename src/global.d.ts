declare module "*.module.css";

interface Window {
  electron: {
    notificationApi: {
      sendMessage: (channel: string, data: any) => void;
      onMessage: (channel: string, callback: Function) => void;
    };
  };
}

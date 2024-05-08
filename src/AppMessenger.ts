import isElectron from "is-electron";

interface IpcRendererEvent extends Event {
  ports: MessagePort[];
  sender: IpcRenderer;
  senderId: number;
}

interface IpcRenderer {
  invoke(channel: string, ...args: any[]): Promise<any>;
    on(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): this;
    once(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): this;
    postMessage(channel: string, message: any, transfer?: MessagePort[]): void;
    removeAllListeners(channel: string): this;
    removeListener(channel: string, listener: (...args: any[]) => void): this;
    send(channel: string, ...args: any[]): void;
    sendSync(channel: string, ...args: any[]): any;
    sendTo(webContentsId: number, channel: string, ...args: any[]): void;
    sendToHost(channel: string, ...args: any[]): void;
}

export default class AppMessenger {
  private ipcRenderer?: IpcRenderer;

  constructor() {
    if (isElectron()) {
      import("electron").then((electron) => {
        this.ipcRenderer = electron.ipcRenderer;
      })
    }
  }

  public send(channel: string, ...args: any[]) {
    if (this.ipcRenderer) {
      this.ipcRenderer.send(channel, args);
    }
  }

  public on(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) {
    if (this.ipcRenderer) {
      this.ipcRenderer.on(channel, listener);
    }
  }
}

export const APP_MESSENGER = new AppMessenger();
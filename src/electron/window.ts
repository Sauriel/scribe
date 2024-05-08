'use strict'

import { app, BrowserWindow, Menu } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import fs from "fs";
import os from "os";
import WindowStateKeeper from './windowStateKeeper';

const isMac = process.platform === 'darwin'

const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      {
        label: 'Export PDF to Desktop',
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          if (win) {
            win.webContents.printToPDF({
              marginsType: 1,
              pageSize: 'A4',
              printBackground: true,
              printSelectionOnly: false,
              landscape: false
            })
            .then(data => {
              const home = os.homedir();
              const desktop = `${home}/Desktop`;
              const file = `${desktop}/NornDocument.pdf`;
              fs.writeFile(file, data, function (err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log('PDF Generated Successfully');
                }
              });
            }).catch(error => {
              console.log(error)
            })
          }
        }
      },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  }
]

export default async function createWindow() {
  const windowStateKeeper = new WindowStateKeeper("main");
  // Create the browser window.
  const win = new BrowserWindow({
    x: windowStateKeeper.state.x,
    y: windowStateKeeper.state.y,
    width: windowStateKeeper.state.width,
    height: windowStateKeeper.state.height,
    webPreferences: {
      spellcheck: false,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env
          .ELECTRON_NODE_INTEGRATION as unknown) as boolean
    }
  });
  if (windowStateKeeper.state.isMaximized) {
    win.maximize();
  }

  windowStateKeeper.track(win);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) {
      const devToolsStateKeeper = new WindowStateKeeper("devTools");
      const devtools = new BrowserWindow({
        x: devToolsStateKeeper.state.x,
        y: devToolsStateKeeper.state.y,
        width: devToolsStateKeeper.state.width,
        height: devToolsStateKeeper.state.height
      });
      if (devToolsStateKeeper.state.isMaximized) {
        devtools.maximize();
      }
      win.webContents.setDevToolsWebContents(devtools.webContents)
      win.webContents.openDevTools({ mode: "detach" });

      devToolsStateKeeper.track(devtools);
    }
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  // @ts-ignore
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
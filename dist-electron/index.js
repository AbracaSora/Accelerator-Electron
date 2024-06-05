"use strict";
const electron = require("electron");
let win;
const createWindow = () => {
  win = new electron.BrowserWindow({
    webPreferences: {
      devTools: true,
      // 集成网页和 Node.js，也就是在渲染进程中，可以调用 Node.js 方法
      nodeIntegration: true,
      contextIsolation: false
    },
    resizable: false,
    width: 800,
    height: 600
  });
  win.loadURL("http://localhost:5173");
};
electron.app.whenReady().then(createWindow);

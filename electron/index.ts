// app 控制应用程序的事件生命周期（相当于应用程序）
// BrowserWindow 创建并控制浏览器窗口（相当于打开桌面弹框）
import { app, BrowserWindow } from 'electron'
import path from 'path'
 
// 定义全局变量，获取窗口实例
let win: BrowserWindow | null;
 
/**
 * 创建一个窗口
 */
const createWindow = () => {
  win = new BrowserWindow({
    webPreferences: {
      devTools: true,
      // 集成网页和 Node.js，也就是在渲染进程中，可以调用 Node.js 方法
      nodeIntegration: true,
      contextIsolation: false,
    },
    resizable: false,
    width: 800,
    height: 600,
  })
    // 集成网页和 Node.js 后，需要加载
    // 这里接收的网址是指：Vite 启动后，会在本地运行一个服务，把这个服务网址丢进去就行
    // 使用 Vite 自带的环境变量 VITE_DEV_SERVER_HOST
    // 如果是 undefined，就换成 VITE_DEV_SERVER_HOSTNAME
    
win.loadURL('http://localhost:5173')
}
 
// 初始化app（在 Electron 完成初始化时触发），挂载上面创建的 桌面应用程序窗口
app.whenReady().then(createWindow)
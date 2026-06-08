// main.js — Electron 主进程
const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain } = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 380,
    height: 560,
    resizable: false,
    frame: false,
    transparent: false,
    backgroundColor: '#1a1a2e',
    icon: createAppIcon(),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createAppIcon() {
  return nativeImage.createFromPath(path.join(__dirname, 'build', 'icon.png'));
}

function createTray() {
  const icon = createAppIcon().resize(16, 16);
  tray = new Tray(icon);
  tray.setToolTip('🍅 番茄钟');

  const contextMenu = Menu.buildFromTemplate([
    { label: '🍅 显示窗口', click: () => mainWindow && mainWindow.show() },
    { type: 'separator' },
    { label: '退出', click: () => app.quit() },
  ]);
  tray.setContextMenu(contextMenu);
}

// IPC 事件
ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

// App 生命周期
app.whenReady().then(() => {
  createWindow();
  createTray();
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

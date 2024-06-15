const { app, BrowserWindow } = require("electron");
const path = require("path");
const { setupIpcHandlers } = require("./ipcHandlers");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  // mainWindow.loadURL("http://localhost:3000");
  mainWindow.loadURL(`file://${path.join(__dirname, "../../build/index.html")}`);
}

app.whenReady().then(() => {
  createWindow();
  setupIpcHandlers();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

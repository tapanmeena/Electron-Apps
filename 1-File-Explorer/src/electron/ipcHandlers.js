const { ipcMain, app } = require("electron");
const fs = require("fs");
const path = require("path");

const formatSize = (size) => {
  var i = Math.floor(Math.log(size) / Math.log(1024));
  return (size / Math.pow(1024, i)).toFixed(2) * 1 + " " + ["B", "kB", "MB", "GB", "TB"][i];
};

function setupIpcHandlers() {
  ipcMain.handle("list-files", async (event, dir) => {
    const directory = dir || __dirname; // Use current directory if dir is blank
    return new Promise((resolve, reject) => {
      fs.readdir(directory, (err, files) => {
        if (err) {
          reject(err);
        } else {
          let fileList = files.map((file) => {
            const filePath = path.join(directory, file);
            const stats = fs.statSync(filePath);
            return {
              name: file,
              size: stats.isFile() ? formatSize(stats.size ?? 0) : null,
              directory: stats.isDirectory(),
            };
          });
          resolve(fileList);
        }
      });
    });
  });

  ipcMain.handle("get-app-path", async () => {
    return app.getAppPath();
  });

  ipcMain.handle("join-path", async (event, ...paths) => {
    return path.join(...paths);
  });

  ipcMain.handle("go-back", async (event, currentPath) => {
    return path.dirname(currentPath);
  });
}

module.exports = { setupIpcHandlers };

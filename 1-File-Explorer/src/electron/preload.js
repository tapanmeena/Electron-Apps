const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  listFiles: (dir) => ipcRenderer.invoke('list-files', dir),
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  joinPath: (...paths) => ipcRenderer.invoke('join-path', ...paths),
  goBack: (currentPath) => ipcRenderer.invoke('go-back', currentPath),
});

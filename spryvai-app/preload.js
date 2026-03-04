const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('spryvai', {
  getApiKey:      ()           => ipcRenderer.invoke('get-api-key'),
  setApiKey:      (key)        => ipcRenderer.invoke('set-api-key', key),
  getProyectos:   ()           => ipcRenderer.invoke('get-proyectos'),
  saveProyectos:  (data)       => ipcRenderer.invoke('save-proyectos', data),
  exportarDoc:    (nombre, txt)=> ipcRenderer.invoke('exportar-doc', { nombre, contenido: txt })
});

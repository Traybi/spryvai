const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');

// Guardar configuración en AppData del usuario
const Store = require('electron-store');
const store = new Store({
  name: 'spryvai-config',
  encryptionKey: 'spryvai-deloitte-2026'
});

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'SpryvAI',
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    backgroundColor: '#0a0a0a',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    titleBarStyle: 'default',
    autoHideMenuBar: true
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ── IPC: API KEY ──
ipcMain.handle('get-api-key', () => {
  return store.get('apiKey', '');
});

ipcMain.handle('set-api-key', (event, key) => {
  store.set('apiKey', key.trim());
  return true;
});

// ── IPC: PROYECTOS (persistencia local) ──
ipcMain.handle('get-proyectos', () => {
  return store.get('proyectos', null);
});

ipcMain.handle('save-proyectos', (event, proyectos) => {
  store.set('proyectos', proyectos);
  return true;
});

// ── IPC: EXPORTAR DOCUMENTO ──
ipcMain.handle('exportar-doc', (event, { nombre, contenido }) => {
  const { dialog } = require('electron');
  const result = dialog.showSaveDialogSync(mainWindow, {
    title: 'Guardar documento',
    defaultPath: path.join(app.getPath('documents'), nombre + '.txt'),
    filters: [
      { name: 'Documento de texto', extensions: ['txt'] },
      { name: 'Todos los archivos', extensions: ['*'] }
    ]
  });
  if (result) {
    fs.writeFileSync(result, contenido, 'utf-8');
    return { ok: true, ruta: result };
  }
  return { ok: false };
});

// ═══════════════════════════════════════════════════════════════════════════
// SpryvAI · main.js (proceso principal de Electron)
// ═══════════════════════════════════════════════════════════════════════════
//
// Este archivo:
//   1. Crea la ventana de la app
//   2. Carga el HTML principal (src/index.html)
//   3. Configura el menú con TODOS los shortcuts de copiar/pegar/etc.
//      ↑ Sin esto, en Electron no funciona ni Ctrl+C ni Ctrl+V
//
// Si ya tienes un main.js con personalización (contador FPS, etc.),
// la parte clave que TE FALTA es el Menu.setApplicationMenu de abajo.
// Cópiala a tu main.js existente justo después de crear la ventana.
//
// ═══════════════════════════════════════════════════════════════════════════

const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: 'SpryvAI',
    icon: path.join(__dirname, 'assets', 'icon.png'), // ajusta si tu icono está en otra ruta
    backgroundColor: '#0a0a0a',
    autoHideMenuBar: false, // mostrar barra de menú (donde están Editar, Ver, etc.)
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  // Abrir enlaces externos en el navegador del SO, no en la app
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// ─── MENU con shortcuts de edición (copiar, pegar, cortar, etc.) ──────────
// ESTA ES LA PARTE CRÍTICA. Sin este menú, Ctrl+C / Ctrl+V no funcionan
// dentro de la app porque Electron no los activa por defecto.
const menuTemplate = [
  {
    label: 'Archivo',
    submenu: [
      { role: 'reload', label: 'Recargar', accelerator: 'CmdOrCtrl+R' },
      { role: 'forceReload', label: 'Forzar recarga', accelerator: 'CmdOrCtrl+Shift+R' },
      { type: 'separator' },
      { role: 'quit', label: 'Salir' }
    ]
  },
  {
    label: 'Editar',
    submenu: [
      { role: 'undo',      label: 'Deshacer',           accelerator: 'CmdOrCtrl+Z' },
      { role: 'redo',      label: 'Rehacer',            accelerator: 'CmdOrCtrl+Y' },
      { type: 'separator' },
      { role: 'cut',       label: 'Cortar',             accelerator: 'CmdOrCtrl+X' },
      { role: 'copy',      label: 'Copiar',             accelerator: 'CmdOrCtrl+C' },
      { role: 'paste',     label: 'Pegar',              accelerator: 'CmdOrCtrl+V' },
      { role: 'selectAll', label: 'Seleccionar todo',   accelerator: 'CmdOrCtrl+A' }
    ]
  },
  {
    label: 'Ver',
    submenu: [
      { role: 'zoomIn',    label: 'Acercar',            accelerator: 'CmdOrCtrl+=' },
      { role: 'zoomOut',   label: 'Alejar',             accelerator: 'CmdOrCtrl+-' },
      { role: 'resetZoom', label: 'Restablecer zoom',   accelerator: 'CmdOrCtrl+0' },
      { type: 'separator' },
      { role: 'togglefullscreen', label: 'Pantalla completa', accelerator: 'F11' },
      { role: 'toggleDevTools',   label: 'Consola de desarrollador', accelerator: 'F12' }
    ]
  }
];

app.whenReady().then(() => {
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

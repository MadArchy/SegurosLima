const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, 'src', 'assets', 'logo.png'),
    title: 'Seguros Lima — Cúcuta, Colombia',
    show: false,
    backgroundColor: '#0E2C6E',
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open external links in default browser (WhatsApp, maps, etc.)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    const fileUrl = 'file://';
    if (!url.startsWith(fileUrl)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
}

// Custom menu
function createMenu() {
  const template = [
    {
      label: 'Seguros Lima',
      submenu: [
        { label: 'Inicio', click: () => mainWindow.loadFile('src/index.html') },
        { label: 'Servicios', click: () => mainWindow.loadFile('src/servicios.html') },
        { label: 'Cotización', click: () => mainWindow.loadFile('src/cotizacion.html') },
        { label: 'Sobre Nosotros', click: () => mainWindow.loadFile('src/nosotros.html') },
        { label: 'Contacto', click: () => mainWindow.loadFile('src/contacto.html') },
        { label: 'Blog', click: () => mainWindow.loadFile('src/blog.html') },
        { type: 'separator' },
        { role: 'quit', label: 'Salir' }
      ]
    },
    {
      label: 'Ver',
      submenu: [
        { role: 'reload', label: 'Recargar' },
        { role: 'togglefullscreen', label: 'Pantalla Completa' },
        { type: 'separator' },
        { role: 'zoomin', label: 'Acercar' },
        { role: 'zoomout', label: 'Alejar' },
        { role: 'resetzoom', label: 'Zoom Normal' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();
  createMenu();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

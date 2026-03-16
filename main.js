const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // Премахваме preload реда, ако нямаш такъв файл, 
      // за да не дава грешка при стартиране.
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Важно: Увери се, че пътят до index.html е правилен спрямо папката dist
  win.loadFile(path.join(__dirname, 'dist/index.html'));

  // Опционално: отваряне на инструментите за програмисти при старт
  // win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
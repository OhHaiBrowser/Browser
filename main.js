// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const { ipcMain } = require('electron')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'src/main/preload.js'),
      webviewTag: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('src/renderer/index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools();


  ipcMain.on('minimize', (event, arg) => {mainWindow.minimize()});
  ipcMain.on('restore', (event, arg) => {mainWindow.restore()});
  ipcMain.on('maximize', (event, arg) => {mainWindow.maximize()});
  ipcMain.on('close', (event, arg) => {mainWindow.close()});
  ipcMain.on('isMaximized', (event, arg) => {
    event.reply('isMaximized', mainWindow.isMaximized());
  });

  mainWindow.on('resize', () => {
    mainWindow.webContents.send('isMaximized', mainWindow.isMaximized());
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

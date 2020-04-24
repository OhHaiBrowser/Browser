'use strict';
const {electron,app, protocol,globalShortcut} = require('electron');
const {MainWindow} = require('./browser/components/main_window/mainwindow');

let mainWindow = null;
global.sharedObject = {prop1: process.argv};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
	mainWindow = new MainWindow();

	globalShortcut.register('CommandOrControl+Shift+D', () => {
		if(mainWindow.isFocused() == true){
			mainWindow.webContents.openDevTools();
		}
	});

	protocol.registerStringProtocol('mailto', function (req) {
		electron.shell.openExternal(req.url);
	});
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform != 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		mainWindow = new MainWindow();
	}
});

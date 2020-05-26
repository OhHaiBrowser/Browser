'use strict';
const {electron,app, protocol} = require('electron');
const isDev = require('electron-is-dev');
const {AppWindow} = require('./browser/main/app');
const {registerScheme, initInternalPages} = require('./browser/main/internalPages/server');

let mainWindow = null;
global.sharedObject = {prop1: process.argv};
registerScheme();

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
	mainWindow = new AppWindow();

	if(isDev) {
		mainWindow.webContents.openDevTools();
	}

	protocol.registerStringProtocol('mailto', function (req) {
		electron.shell.openExternal(req.url);
	});

	initInternalPages();

});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	protocol.unregisterProtocol('mailto');
	protocol.unregisterProtocol('ohhai');

	if (process.platform != 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		mainWindow = new AppWindow();
	}
});

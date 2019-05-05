'use strict';
const {electron,app, protocol,BrowserWindow,globalShortcut} = require('electron'),
	Store = require('./browser/system_assets/scripts/store.js');

let mainWindow = null;
global.sharedObject = {prop1: process.argv};

// First instantiate the class
const store = new Store({
	// We'll call our data file 'user-preferences'
	configName: 'window-state',
	defaults: {
		windowBounds: { width: 900, height: 600 },
		isMaximised: false
	}
});
let { width, height } = store.get('windowBounds');

function CreateWindow(){

	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: width,
		height: height,
		frame: false,
		icon: `${__dirname}/window/assets/icon.ico`,
		show: false,
		minHeight: 350,
		minWidth: 485,
		webPreferences: {
			nodeIntegration: true
		}
	});

	if(store.get('isMaximised')){
		mainWindow.maximize();
	}

	mainWindow.setMenu(null);	
	mainWindow.loadURL(`file://${__dirname}/browser/index.html`);

	mainWindow.on('closed', function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});

	mainWindow.show();
	mainWindow.focus();

	mainWindow.on('resize', () => {
		let { width, height } = mainWindow.getBounds();
		if(!mainWindow.isMaximized()){
			store.set('windowBounds', { width, height });
		}
		store.set('isMaximised',mainWindow.isMaximized());
	});

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {

	CreateWindow();

	globalShortcut.register('CommandOrControl+Shift+D', () => {
		if(mainWindow.isFocused() == true){
			mainWindow.webContents.openDevTools();
		}
	});

	protocol.registerStringProtocol('mailto', function (req, cb) {
		electron.shell.openExternal(req.url);
		return null;
	}, function (error) {});

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
		CreateWindow()
	}
});

'use strict';

var {electron,app, protocol,BrowserWindow,globalShortcut} = require('electron');
var Store = require('./browser/system_assets/scripts/window/store.js');
//var OhHaiProtocol = require('./system_assets/Scripts/protocol/ohhai');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

global.sharedObject = {prop1: process.argv}

// First instantiate the class
const store = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'window-state',
  defaults: {
    // 900x600 is the default size of our window
    windowBounds: { width: 900, height: 600 },
    isMaximised: false
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {

	let { width, height } = store.get('windowBounds');


  // Create the browser window.
  mainWindow = new BrowserWindow({
		width: width,
		height: height,
		frame: false,
		icon: __dirname + '/window/assets/icon.ico',
		show: false,
    minHeight: 350,
    minWidth: 485
	});

  if(store.get('isMaximised')){
    mainWindow.maximize();
  }

	mainWindow.on('ready-to-show', function() {
      mainWindow.show();
      mainWindow.focus();
	});
  
  
globalShortcut.register('CommandOrControl+Shift+D', () => {
  if(mainWindow.isFocused() == true){
      mainWindow.webContents.openDevTools();
  }
});
	
	mainWindow.loadURL("file:///" + __dirname + '/browser/index.html');

		
  mainWindow.on('resize', () => {
    let { width, height } = mainWindow.getBounds();
    if(!mainWindow.isMaximized()){
      store.set('windowBounds', { width, height });
    }
    store.set('isMaximised',mainWindow.isMaximized());
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {

    mainWindow = null;
  });



});

import electron, {app, protocol,BrowserWindow,globalShortcut} from 'electron';
import Store from './system_assets/scripts/store.js';

let mainWindow: BrowserWindow = null;
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
const { width, height } = store.get('windowBounds');

function CreateWindow() {

	// Create the browser window.
	mainWindow = new BrowserWindow({
		width,
		height,
		titleBarStyle: 'hiddenInset',
		frame: false,
		icon: `${__dirname}/dist/assets/imgs/frame/icon.png`,
		show: false,
		minHeight: 350,
		minWidth: 485,
		webPreferences: {
			preload: `${__dirname}/dist/preload.js`,
			nodeIntegration: true,
			webviewTag: true
		}
	});

	if (store.get('isMaximised')) {
		mainWindow.maximize();
	}

	mainWindow.setMenu(null);
	mainWindow.loadURL(`file://${__dirname}/dist/index.html`);

	mainWindow.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});

	mainWindow.show();
	mainWindow.focus();

	mainWindow.on('resize', () => {
		if (!mainWindow.isMaximized()) {
			store.set('windowBounds', {
                width: mainWindow.getBounds().width,
                height: mainWindow.getBounds().height
            });
		}
		store.set('isMaximised',mainWindow.isMaximized());
	});

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', () => {

	CreateWindow();

	globalShortcut.register('CommandOrControl+Shift+D', () => {
		if (mainWindow.isFocused() === true) {
			mainWindow.webContents.openDevTools();
		}
	});

	protocol.registerStringProtocol('mailto', (req, cb) => {
		electron.shell.openExternal(req.url);
		return null;
	});
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		CreateWindow();
	}
});
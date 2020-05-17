const {BrowserWindow, app} = require('electron');
const Store = require('../../services/store.service');
const path = require('path');

class MainWindow extends BrowserWindow {
	constructor() {
		const store = new Store({
			// We'll call our data file 'user-preferences'
			configName: 'window-state',
			defaults: {
				windowBounds: { width: 900, height: 600 },
				isMaximised: false
			}
		});
		let { width, height } = store.get('windowBounds');
		
		let iconPath = path.join(app.getAppPath(), '/browser/assets/icons/icon.png');
		let preloadScript = path.join(app.getAppPath(), '/browser/preload.js');
		
		super({
			width,
			height,
			title: app.name,
			titleBarStyle: 'hidden',
			frame: false,
			icon: iconPath,
			show: false,
			minHeight: 350,
			minWidth: 485,
			webPreferences: {
				preload: preloadScript,
				webviewTag: true
			}
		});
		let win = this;

		if(store.get('isMaximised')){
			win.maximize();
		}
	
		win.removeMenu();
		win.loadFile(`${path.join(app.getAppPath(), '/browser/index.html')}`);
	
		win.once('ready-to-show', win.show);

		win.on('closed', () => {
			win = null;
		});
	
		win.focus();
	
		win.on('resize', () => {
			if(!win.isMaximized()){
				store.set('windowBounds', { 
					width: win.getBounds().width, 
					height: win.getBounds().height
				});
			}
			store.set('isMaximised', win.isMaximized());
		});
	}
}

module.exports.MainWindow = MainWindow;
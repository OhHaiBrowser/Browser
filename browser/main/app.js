const {BrowserWindow, app} = require('electron');
const {startMessagingAgent} = require('./messaging');
const {AppMenu} = require('./menus/main');
const Store = require('../services/store.service');
const path = require('path');

class AppWindow extends BrowserWindow {
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

		super({
			width,
			height,
			title: app.title,
			titleBarStyle: 'hidden',
			frame: false,
			icon: iconPath,
			show: false,
			minHeight: 350,
			minWidth: 485,
			webPreferences: {
				webviewTag: true,
				nodeIntegration: true,
				plugins: true,
				webSecurity: true,
				javascript: true,
			}
		});    
        
		let win = this;
        
		startMessagingAgent();
		
		if(store.get('isMaximised')){
			win.maximize();
		}

		win.setMenu(AppMenu(win));
		win.loadFile(`${path.join(app.getAppPath(), '/browser/renderer/index.html')}`);
	
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

module.exports.AppWindow = AppWindow;
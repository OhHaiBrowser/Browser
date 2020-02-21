const {BrowserWindow} = require('electron');
const Store = require('../../system_assets/scripts/store');

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
		super({
			width,
			height,
			titleBarStyle: 'hiddenInset',
			frame: false,
			icon: `${__dirname}/browser/assets/imgs/frame/icon.png`,
			show: false,
			minHeight: 350,
			minWidth: 485,
			webPreferences: {
				preload: `${__dirname}/browser/preload.js`,
				nodeIntegration: true,
				webviewTag: true
			}
		});
		let win = this;

		if(store.get('isMaximised')){
			win.maximize();
		}
	
		win.setMenu(null);	
		win.loadURL(`file://${__dirname}/browser/index.html`);
	
		win.on('closed', () => {
			win = null;
		});
	
		win.show();
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
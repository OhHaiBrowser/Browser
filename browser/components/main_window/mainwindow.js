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

		if(store.get('isMaximised')){
			this.maximize();
		}
	
		this.setMenu(null);	
		this.loadURL(`file://${__dirname}/browser/index.html`);
	
		this.on('closed', function () {
			this = null;
		});
	
		this.show();
		this.focus();
	
		this.on('resize', () => {
			if(!this.isMaximized()){
				store.set('windowBounds', { 
					width: this.getBounds().width, 
					height: this.getBounds().height
				});
			}
			store.set('isMaximised', this.isMaximized());
		});
	}
}

module.exports.MainWindow = MainWindow;
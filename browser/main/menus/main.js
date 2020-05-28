const { Menu, app, ipcMain } = require('electron');

const isMac = process.platform === 'darwin';

const createSubItems = (accelerators, click, label = null) => {
	const items = accelerators.map((accelerator, key) => ({
		accelerator,
		visible: label != null && key === 0,
		label: label != null && key === 0 ? label : '',
		click
	}));
	return items;
};

module.exports.AppMenu = (win) => {

	return Menu.buildFromTemplate([
		...(isMac ? [
			{
				label: app.name,
				submenu: [
					{ role: 'about' },
					{ type: 'separator' },
					{ role: 'services' },
					{ type: 'separator' },
					{ role: 'hide' },
					{ role: 'hideothers' },
					{ role: 'unhide' },
					{ type: 'separator' },
					{ role: 'quit' },
				],
			}
		] : []),
		{
			label: 'File', 
			submenu: [
				{
					accelerator: 'CmdOrCtrl+T',
					label: 'New tab',
					visible: true,
					click: () => {win.webContents.send('shortcut-key', 'tab-new');}       
				},
				{
					accelerator: 'CmdOrCtrl+Shift+N',
					label: 'New incognito tab',
					visible: true,
					click: () => {win.webContents.send('shortcut-key', 'tab-new-incog');}        
				},
				...createSubItems(['CmdOrCtrl+W', 'CmdOrCtrl+F4'], () => {
					win.webContents.send('shortcut-key', 'tab-close');
				}, 'Close tab'),
				{
					accelerator: 'CmdOrCtrl+Shift+W',
					label: 'Close window',
					visible: true,
					click: () => {
						win.webContents.send('shortcut-key', 'window-close');
					}       
				},
				{
					type: 'separator',
				},
				...createSubItems(['Ctrl+Space', 'CmdOrCtrl+L', 'Alt+D', 'F6'], ()=> {
					win.webContents.send('shortcut-key', 'navbar-select');
				})
			]
		}, 
		{
			label: 'View', 
			submenu: [
				...createSubItems(['CmdOrCtrl+R', 'F5'], () => {
					win.webContents.send('shortcut-key', 'web-refresh');
				}, 'Reload'),
				...createSubItems(['CmdOrCtrl+Shift+R', 'Shift+F5'], () => {
					win.webContents.send('shortcut-key', 'web-refresh-hard');
				}, 'Reload ignoring cache')
			]
		},
		{
			label: 'History',
			submenu: [
				...createSubItems(isMac ? ['Cmd+[', 'Cmd+Left'] : ['Alt+Left'], () => {
					win.webContents.send('shortcut-key', 'web-back');
				}, 'Go back'),
				...createSubItems(isMac ? ['Cmd+]', 'Cmd+Right'] : ['Alt+Right'], () => {
					win.webContents.send('shortcut-key', 'web-forward');
				}, 'Go forward'),
				{ type: 'separator' },
				...createSubItems(isMac ? ['Cmd+Y'] : ['Ctrl+H'], () => {
					win.webContents.send('shortcut-key', 'history-show');
				}, 'Manage history'),
			]
		},
		{
			label: 'Bookmarks',
			submenu: [
				...createSubItems(['CmdOrCtrl+B'], () => {
					win.webContents.send('shortcut-key', 'bookmarks-show');
				}, 'Show bookmarks'),
				...createSubItems(['CmdOrCtrl+D'], () => {
					win.webContents.send('shortcut-key', 'bookmarks-new');
				}, 'Add this website to bookmarks'),
			]
		},
		{
			label: 'Tools',
			submenu: [
				{
					label: 'Developer',
					submenu: [
						{
							label: 'View source',
							accelerator: 'CmdOrCtrl+U',
							click: () => {
								win.webContents.send('shortcut-key', 'web-view-source');
							}
						},
						...createSubItems(['CmdOrCtrl+Shift+I', 'CmdOrCtrl+Shift+J', 'F12'], () => {
							win.webContents.send('shortcut-key', 'web-inspect');
						}, 'Developer tools...')
					]
				}
			]
		},
		{
			label: 'Tab',
			submenu: [
				...createSubItems(['CmdOrCtrl+D'], () => {
					win.webContents.send('shortcut-key', 'tab-select-next');
				}, 'Show next tab'),
				...createSubItems(['CmdOrCtrl+D'], () => {
					win.webContents.send('shortcut-key', 'tab-select-previous');
				}, 'Show previous tab'),
			]
		},
		{
			label: 'Window',
			submenu: [
				{ role: 'minimize' },
				{ role: 'zoom' },
				...(isMac
					? [
						{ type: 'separator' },
						{ role: 'front' },
						{ type: 'separator' },
						{ role: 'window' },
					]
					: [{ role: 'close', accelerator: '' }]),
			]
		}
	]);

};
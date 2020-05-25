const { Menu, app, MenuItem } = require('electron');

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

module.exports.AppMenu = () => {

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
					click: () => {
						console.log('New tab');
					}       
				},
				{
					accelerator: 'CmdOrCtrl+Shift+N',
					label: 'New incognito tab',
					visible: true,
					click: () => {
						console.log('New incog tab');
					}       
				},
				...createSubItems(['CmdOrCtrl+W', 'CmdOrCtrl+F4'], () => {
					console.log('Close tab');
				}, 'Close tab'),
				{
					accelerator: 'CmdOrCtrl+Shift+W',
					label: 'Close window',
					visible: true,
					click: () => {
						console.log('Close window');
					}       
				},
				{
					type: 'separator',
				},
				...createSubItems(['Ctrl+Space', 'CmdOrCtrl+L', 'Alt+D', 'F6'], ()=> {
					console.log('Select navbar');
				})
			]
		}, 
		{
			label: 'Edit', 
			submenu: [
				{ role: 'undo' },
				{ role: 'redo' },
				{ type: 'separator' },
				{ role: 'cut' },
				{ role: 'copy' },
				{ role: 'paste' },
				...(isMac
					? [
						{ role: 'pasteAndMatchStyle' },
						{ role: 'delete' },
						{ role: 'selectAll' },
						{ type: 'separator' },
						{
							label: 'Speech',
							submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }],
						},
					]
					: [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }]),
			]
		},
		{
			label: 'View', 
			submenu: [
				...createSubItems(['CmdOrCtrl+R', 'F5'], () => {
					console.log('Refresh page');
				}, 'Reload'),
				...createSubItems(['CmdOrCtrl+Shift+R', 'Shift+F5'], () => {
					console.log('Refresh page');
				}, 'Reload ignoring cache')
			]
		},
		{
			label: 'History',
			submenu: [
				...createSubItems(isMac ? ['Cmd+[', 'Cmd+Left'] : ['Alt+Left'], () => {
					console.log('Go back');
				}, 'Go back'),
				...createSubItems(isMac ? ['Cmd+]', 'Cmd+Right'] : ['Alt+Right'], () => {
					console.log('Go forward');
				}, 'Go forward'),
				{ type: 'separator' },
				...createSubItems(isMac ? ['Cmd+Y'] : ['Ctrl+H'], () => {
					console.log('Show history');
				}, 'Manage history'),
			]
		},
		{
			label: 'Bookmarks',
			submenu: [
				...createSubItems(['CmdOrCtrl+B'], () => {
					console.log('Show bookmarks');
				}, 'Show bookmarks'),
				...createSubItems(['CmdOrCtrl+D'], () => {
					console.log('Add this website to bookmarks');
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
								console.log('View source')
							}
						},
						...createSubItems(['CmdOrCtrl+Shift+I', 'CmdOrCtrl+Shift+J', 'F12'], () => {
							console.log('Open developer tools');
						}, 'Developer tools...')
					]
				}
			]
		},
		{
			label: 'Tab',
			submenu: [
				...createSubItems(['CmdOrCtrl+D'], () => {
					console.log('Show next tab');
				}, 'Show next tab'),
				...createSubItems(['CmdOrCtrl+D'], () => {
					console.log('Show previous tab');
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
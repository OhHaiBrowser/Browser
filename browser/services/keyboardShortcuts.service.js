const { globalShortcut, remote } = require('electron');
const thisWindow = remote.getCurrentWindow();

module.exports.initShortcuts = () => {

	globalShortcut.register('CommandOrControl+B', () => {
		if(thisWindow.isFocused()) {
			const sideBar = document.getElementById('Sid');
			sideBar.showPanel(sideBar.panels().item(1));
		}
	});

};
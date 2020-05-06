const {remote} = require('electron');
const {Menu, MenuItem} = remote;
const {Settings} = require('../system_assets/modules/OhHaiBrowser.Data');
const {tabs} = require('./tabs.service');

const tabbar = {
	panel() {return document.getElementById('Sid');},
	tabcontainer() {return document.getElementById('tabs-menu');},
	pinnedtabcontainer() {return document.getElementById('tabs-dock');},
	webviewcontainer() {return document.getElementById('BrowserWin');},
	addTabBtn() {return document.getElementById('AddTab');},
	pined: true,
	toggle() {
		if (tabbar.pined == true) {
			tabbar.panel().classList.add('LeftMenuHidden');
			tabbar.panel().classList.remove('LeftMenuShow');
			tabbar.pined = false;
			Settings.Set('TabBar', false);
		} else {
			tabbar.panel().classList.add('LeftMenuShow');
			tabbar.panel().classList.remove('LeftMenuHidden');
			tabbar.pined = true;
			Settings.Set('TabBar', true);
		}
	},
	contextMenu() {
		var NewMenu = new Menu();
		NewMenu.append(new MenuItem({
			label: 'New Tab',
			click() {
				tabs.add(window.OhHaiBrowser.settings.homepage, undefined, {
					selected: true
				});
			}
		}));
		NewMenu.append(new MenuItem({
			label: 'New Incognito Tab',
			click() {
				tabs.add(window.OhHaiBrowser.settings.homepage, undefined, {
					selected: true,
					mode: 'incog'
				});
			}
		}));
		NewMenu.append(new MenuItem({
			label: 'New Group',
			click() {
				tabs.groups.add(null, null, null);
			}
		}));
		return NewMenu;
	}
};

module.exports.tabbar = tabbar;
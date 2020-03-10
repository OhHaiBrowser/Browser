var {remote} = require('electron'),
	{Menu,	MenuItem} = remote, 
	{Settings} = require('./OhHaiBrowser.Data'),
	{tabs} = require('../../services/tabs.service');

var TabBar = {
	panel: () => document.getElementById('LeftMenu'),
	tabcontainer: () => document.getElementById('tabs-menu'),
	pinnedtabcontainer: () => document.getElementById('tabs-dock'),
	webviewcontainer: () => document.getElementById('BrowserWin'),
	addTabBtn: () => document.getElementById('AddTab'),
	pined: true,
	toggle: function () {
		if (TabBar.pined == true) {
			TabBar.panel().classList.add('LeftMenuHidden');
			TabBar.panel().classList.remove('LeftMenuShow');
			TabBar.pined = false;
			Settings.Set('TabBar', false);
		} else {
			TabBar.panel().classList.add('LeftMenuShow');
			TabBar.panel().classList.remove('LeftMenuHidden');
			TabBar.pined = true;
			Settings.Set('TabBar', true);
		}
	},
	contextMenu: () => {
		var NewMenu = new Menu();
		NewMenu.append(new MenuItem({
			label: 'New Tab',
			click() {
				tabs.add(OhHaiBrowser.settings.homepage, undefined, {
					selected: true
				});
			}
		}));
		NewMenu.append(new MenuItem({
			label: 'New Incognito Tab',
			click() {
				tabs.add(OhHaiBrowser.settings.homepage, undefined, {
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

module.exports = TabBar;
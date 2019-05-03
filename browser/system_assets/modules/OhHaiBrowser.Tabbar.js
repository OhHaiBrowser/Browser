var {Settings} = require('./OhHaiBrowser.Data');

var TabBar = {
	panel: document.getElementById('LeftMenu'),
	tabcontainer: document.getElementById('tabs-menu'),
	pinnedtabcontainer: document.getElementById('tabs-dock'),
	webviewcontainer: document.getElementById('BrowserWin'),
	pined: true,
	toggle: function () {
		if (TabBar.pined == true) {
			TabBar.panel.classList.add('LeftMenuHidden');
			TabBar.panel.classList.remove('LeftMenuShow');
			TabBar.pined = false;
			Settings.Set('TabBar', false, function () {});
		} else {
			TabBar.panel.classList.add('LeftMenuShow');
			TabBar.panel.classList.remove('LeftMenuHidden');
			TabBar.pined = true;
			Settings.Set('TabBar', true, function () {});
		}
	}
}

module.exports = TabBar;
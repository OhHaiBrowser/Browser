var {Settings} = require('./OhHaiBrowser.Data');

module.exports = {
	panel: document.getElementById('LeftMenu'),
	tabcontainer: document.getElementById('tabs-menu'),
	pinnedtabcontainer: document.getElementById('tabs-dock'),
	webviewcontainer: document.getElementById('BrowserWin'),
	pined: true,
	toggle: function () {
		if (this.pined == true) {
			this.panel.classList.add('LeftMenuHidden');
			this.panel.classList.remove('LeftMenuShow');
			this.pined = false;
			Settings.Set('TabBar', false, function () {});
		} else {
			this.panel.classList.add('LeftMenuShow');
			this.panel.classList.remove('LeftMenuHidden');
			this.pined = true;
			Settings.Set('TabBar', true, function () {});
		}
	}
};
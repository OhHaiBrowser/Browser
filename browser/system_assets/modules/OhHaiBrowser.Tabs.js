let tabView = require('./system_assets/modules/TabView.js');
let CoreFunctions = require('./system_assets/modules/OhHaiBrowser.Core.js');

module.exports = {
	count: 0,
	tabMap: new Map,
	add: (_URL,_ID,_OPTIONS,callback) => {
		let IsNew = false;
		if(_ID == undefined){_ID = CoreFunctions.generateId(); IsNew = true;}
		let NewTabView = tabView({
			id: _ID,
			url: _URL,
			mode: _OPTIONS.mode,
			title: _OPTIONS.title,
			favicon: _OPTIONS.favicon
		});

		this.tabMap.set(_ID,NewTabView);
		this.count++;
		OhHaiBrowser.ui.navbar.updateTabCounter();
				
		if (typeof callback === "function") {
			callback(NewTabView);
		}
	},
	remove: (_TAB, callback) => {

	},
	get: (tabId, callback) => {

	},
	isCurrent: (_Tab) => {

	},
	setCurrent: (tab, webview, callback) => {

	},
	ismode: (_tab, _mode, callback) => {

	},
	setMode: (_tab, _mode, callback) => {

	},
	executeScript: (tabid, code, callback) => {

	},
	insertCSS: (tabid, code, callback) => {

	},
	reload: (tabid, callback) => {

	}
}
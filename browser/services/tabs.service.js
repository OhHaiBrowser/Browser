let CoreFunctions = require('../system_assets/modules/OhHaiBrowser.Core'),
	{ Sessions, Groups } = require('../system_assets/modules/OhHaiBrowser.Data'),
	{tabbar} = require('./tabbar.service'),
	{ functions } = require('./navbar.service'),
	{ WebSession } = require('../components/websession/websession.component'),
	{ Group } = require('../components/websession/group/group.component');

const Tabs = {
	count: 0,
	tabMap: new Array(),
	/**
 * 
 * @param {string} _URL 
 * @param {string} _ID 
 * @param {object} _OPTIONS 
 * @param {void} callback 
 */
	add: (_URL, _ID = undefined, _OPTIONS = {}) => {
		return new Promise((resolve) => {
			let IsNew = _ID == undefined ? true : false;
			_ID = _ID == undefined ? CoreFunctions.generateId() : _ID;  
	
			let NewWS = new WebSession({
				id: _ID,
				url: _URL,
				_OPTIONS
			});
	
			//Are there options?
			if (_OPTIONS) {
				if (_OPTIONS.selected == true) {
					Tabs.setCurrent(NewWS);
				}
				if (_OPTIONS.mode) {
					switch (_OPTIONS.mode.toString().toLowerCase()) {
					case 'dock':
						tabbar.pinnedtabcontainer().appendChild(NewWS.tab);
						break;
					case 'incog':
						tabbar.tabcontainer().appendChild(NewWS.tab);
						break;
					case 'grouped':
						if (_OPTIONS.parent) {
							if (typeof _OPTIONS.parent == 'string') {
								_OPTIONS.parent = document.getElementById(_OPTIONS.parent);
							}
							if (_OPTIONS.parent != null) {
								if (_OPTIONS.parent.classList.contains('ohhai-group-children')) {
									_OPTIONS.parent.appendChild(NewWS.tab);
								} else {
									var GroupedTabs = _OPTIONS.parent.querySelector('.ohhai-group-children');
									GroupedTabs.appendChild(NewWS.tab);
								}
							} else {
								tabbar.tabcontainer().appendChild(NewWS.tab);
							}
						} else {
							_OPTIONS.parent.appendChild(NewWS.tab);
						}
						break;
					case 'default':
					default:
						tabbar.tabcontainer().appendChild(NewWS.tab);
					}
				} else {
					_OPTIONS.mode = 'default';
					tabbar.tabcontainer().appendChild(NewWS.tab);
				}
			} else {
				//load basic defaults
				tabbar.tabcontainer().appendChild(NewWS.tab);
			}
			tabbar.webviewcontainer().appendChild(NewWS.webview);
	
			if (NewWS.mode != 'incog') {
				if (IsNew) {
					var TabParent = null;
					switch (NewWS.tab.parentElement.className) {
					case 'ohhai-group-children':
						var FirstTabParent = NewWS.tab.parentElement;
						TabParent = FirstTabParent.parentElement.id;
						break;
					default:
						TabParent = NewWS.tab.parentElement.id;
					}
					Sessions.Set(_ID, 'default', 'TempTitle', _OPTIONS.mode, '/assets/imgs/logo.png').then(() => {
						NewWS.tab.setAttribute('data-session', _ID);
						Sessions.UpdateParent(_ID, TabParent);
					});
				} else {
					NewWS.tab.setAttribute('data-session', _ID);
				}
			}
	
			Tabs.tabMap.push(NewWS);
			Tabs.count++;
			functions.updateTabCounter();
	
			resolve(NewWS);
		});
	},
	remove: (_webSession) => {

		var Parent = _webSession.tab.parentElement;
		var webviewParent = document.getElementById('BrowserWin');

		if (Tabs.count > 1) {
			if (_webSession.selected) {
				var Open_Tabs = tabbar.panel().querySelectorAll('tab-item');
				var This_TabIndex;
				Open_Tabs.forEach(function (ArrayElement, index) {
					if (ArrayElement == _webSession.tab) {
						This_TabIndex = index;
					}
				});

				if ((Open_Tabs.length - 1) == This_TabIndex) {
					//Go in a tab
					let thisSession = Tabs.tabMap.find(i => i.tab == Open_Tabs[This_TabIndex - 1]);
					Tabs.setCurrent(thisSession);
				} else {
					//Select next tab
					let thisSession = Tabs.tabMap.find(i => i.tab == Open_Tabs[This_TabIndex + 1]);
					Tabs.setCurrent(thisSession);
				}

				//need to update the URL now
				functions.updateURLBar(Tabs.getCurrent().webview);
			}
		}

		Parent.removeChild(_webSession.tab);
		webviewParent.removeChild(_webSession.webview);

		if (Parent.classList.contains('ohhai-group-children')) {
			var ThisGroup = Parent.parentElement;
			if (Parent.children.length == 0) {
				Tabs.groups.remove(ThisGroup, null);
			}
		}

		Tabs.count--;
		Tabs.tabMap.splice(Tabs.tabMap.findIndex(i => i.id == _webSession.id), 1);

		functions.updateTabCounter();

		if (Tabs.count == 0) {
			Tabs.add('default', undefined, {
				selected: true
			});
		}

		if (_webSession.mode != 'incog') {
			Sessions.Remove(_webSession.id);
		}
	},
	get: (tabid) => {
		return new Promise((resolve) => {
			let wSession = Tabs.tabMap.find(ws => ws.tab.id == tabid);
			resolve(wSession);
		});
	},
	/**
 * 
 * @param {void} callback
 * @returns {WebSession}
 */
	getCurrent: () => {
		let currentWebSession = Tabs.tabMap.find(i => i.selected === true);
		return currentWebSession;
	},
	setCurrent: (_WebSession) => {
		var ctab = Tabs.tabMap.find(i => i.selected === true && i.id !== _WebSession.id);
		if (ctab) {
			ctab.selected = false;
		}
		_WebSession.selected = true;
	},
	setMode: (_WebSession, _mode) => {
		_WebSession.mode = _mode;
		switch (_mode) {
		case 'dock':
			tabbar.pinnedtabcontainer().appendChild(_WebSession.tab);
			break;
		case 'grouped':
			break;
		case 'default':
		default:
			tabbar.tabcontainer().appendChild(_WebSession.tab);
		}
	},
	executeScript: (tabid, code) => {
		Tabs.get(tabid).then(wS => {
			wS.webview.executeJavaScript(code);
		});
	},
	insertCSS: (tabid, code) => {
		Tabs.get(tabid).then(wS => {
			wS.webview.insertCSS(code);
		});
	},
	reload: (tabid) => {
		Tabs.get(tabid).then(wS => {
			wS.webview.reload();
		});
	},
	groups: {
		add: function (_id, _title, _tab, callback) {
			if (_id == null) {
				_id = CoreFunctions.generateId();
			}

			let NewG = new Group(_id, _title);
        
			switch (_tab) {
			case null:
				Tabs.add('default', undefined, {
					selected: true,
					mode: 'grouped',
					parent: NewG.children
				});
				break;
			case 'session':
				break;
			default:
				var TabSessionId = _tab.getAttribute('data-session');
				NewG.children.appendChild(_tab);
				Sessions.UpdateParent(TabSessionId, NewG.id);
			}
			tabbar.tabcontainer().appendChild(NewG.Group);

			Groups.Upsert(NewG.id, NewG.title);

			if (typeof callback == 'function') {
				callback(NewG.group);
			}

		},
		remove: function (_Group, _Options) {
			var GroupedTabs = _Group.querySelectorAll('.ohhai-group-children .tab');
			var GroupParent = _Group.parentElement;

			GroupedTabs.forEach((gt) => {
				Tabs.get(gt.id).then(wS => {
					_Options.keepChildren ? Tabs.groups.removeTab(gt) : Tabs.remove(wS);
				});
			});

			if (_Group.parentElement != null) {
				GroupParent.removeChild(_Group);
			}

			Groups.Remove(_Group.id);
		},
		addTab: function (_tab, _group) {
			if (_group == null) {
				//New Group
				Tabs.groups.add(null, null, _tab);
			} else {
				//Existing group
				var GroupChildren = _group.querySelector('.ohhai-group-children');
				GroupChildren.appendChild(_tab);

				var TabSessionId = _tab.getAttribute('data-session');
				Sessions.UpdateParent(TabSessionId, _group.id);
				Sessions.UpdateMode(TabSessionId, 'grouped');
			}
		},
		removeTab: function (_tab) {
			var thisGroupList = _tab.parentElement;
			var thisGroup = thisGroupList.parentElement;

			tabbar.tabcontainer().appendChild(_tab);

			var TabSessionId = _tab.getAttribute('data-session');
			Sessions.UpdateParent(TabSessionId, tabbar.tabcontainer().id);
			Sessions.UpdateMode(TabSessionId, 'default');

			if (thisGroupList.children.length == 0) {
				var GroupParent = thisGroup.parentElement;
				GroupParent.removeChild(thisGroup);
			}
		}
	},
	activePage: {
		getURL: (callback = null) => {
			var cSession = Tabs.getCurrent();
			if (typeof callback == 'function') {
				callback(cSession.webview.getURL());
			} else {
				return cSession.webview.getURL();
			}
		},
		getTitle: (callback = null) => {
			var cSession = Tabs.getCurrent();
			if (typeof callback == 'function') {
				callback(cSession.webview.getTitle());
			} else {
				return cSession.webview.getTitle();
			}
		},
		goBack: (callback = null) => {
			Tabs.getCurrent().webview.goBack();
			if (typeof callback == 'function') {
				callback('request sent');
			}
		},
		goForward: (callback = null) => {
			Tabs.getCurrent().webview.goForward();
			if (typeof callback == 'function') {
				callback('request sent');
			}
		},
		reload: (callback = null) => {
			Tabs.getCurrent().webview.reload();
			if (typeof callback == 'function') {
				callback('request sent');
			}
		},
		navigate: (url, callback = null) => {
			Tabs.getCurrent().webview.loadURL(url);
			if (typeof callback == 'function') {
				callback('request sent');
			}
		},
		insertCSS: (code, callback = null) => {
			Tabs.getCurrent().webview.insertCSS(code);
			if (typeof callback == 'function') {
				callback('request sent');
			}
		},
		executeJavaScript: (code, callback = null) => {
			Tabs.getCurrent().webview.executeJavaScript(code);
			if (typeof callback == 'function') {
				callback('request sent');
			}
		},
		hasSibling: () => {
			var Sibling = null;
			var cSession = Tabs.getCurrent();
    
			if (cSession.tab.nextSibling) {
				Sibling = {
					'sibling': cSession.tab.nextSibling,
					'location': 'next'
				};
			} else if (cSession.tab.previousSibling) {
				Sibling = {
					'sibling': cSession.tab.previousSibling,
					'location': 'last'
				};
			}

			return Sibling;
		}
	},
	popupwindow: (params, callback = null) => {
		//This is a pop up window - Does the user want this pop up, does it have a parent control? 
		const remote = require('electron').remote;
		const BrowserWindow = remote.BrowserWindow;
		var win = new BrowserWindow({
			width: 800,
			height: 600,
			frame: false,
			icon: `file://${__dirname}/assets/icons/icon.png`,
			show: false,
			webPreferences: {
				preload: `file://${__dirname}/preload.js`,
			}
		});
		win.webContents.on('did-finish-load', () => {
			win.show();
			win.focus();
		});
		win.loadURL(`file://${__dirname}/components/pop_out_window/template.html?url=${params.url}`);

		if (typeof callback === 'function') {
			callback(win);
		} else {
			return win;
		}
	}
};

module.exports.tabs = Tabs;
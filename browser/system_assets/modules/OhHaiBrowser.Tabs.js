let CoreFunctions = require('./OhHaiBrowser.Core'),
	{Sessions, Groups} = require('./OhHaiBrowser.Data'),
	AddListeners = require('./../components/tab_views/script'),
	Tabbar = require('./OhHaiBrowser.Tabbar'),
	{remote} = require('electron');

const Templates = {
	websession: function (_ID, _URL, callback) {

		var tabelement = CoreFunctions.generateElement(`
			<li class='tab' id='t_${_ID}' data-container='wv_${_ID}'>
				<a class='tabMediaBtn hidden'></a>
				<img class='ohhai-tab-fav' src='system_assets/icons/logo.png'/>
				<span class='ohhai-tab-txt'>New Tab</span>
				<a class='TabClose'></a>
			</li>`);

		var PagetoOpen = '';
		switch (_URL) {
		case 'settings':
			PagetoOpen = OhHaiBrowser.builtInPages.settings;
			break;
		case 'history':
			PagetoOpen = OhHaiBrowser.builtInPages.history;
			break;
		case 'quicklinks':
			PagetoOpen = OhHaiBrowser.builtInPages.bookmarks;
			break;
		case 'default':
		case undefined:
		case '':
			PagetoOpen = OhHaiBrowser.builtInPages.home;
			break;
		default:
			PagetoOpen = _URL;
		}

		var viewelement = CoreFunctions.generateElement(`<webview id='wv_${_ID}' src='${PagetoOpen}' class='Hidden'></webview>`);

		callback({
			tab: tabelement,
			webview: viewelement
		});
	},
	group: function (_ID, _Title, callback) {
		var Group = CoreFunctions.generateElement(`
			<li class='group' id='${_ID}'>
				<div class='ohhai-group-header'>
					<input type='text' class='ohhai-group-txt' value='${_Title != null ? _Title : 'New Group'}'/>
					<a class='ohhai-togglegroup'></a>
				</div>
				<ul class='ohhai-group-children'>
				</ul>
			</li>`);

		var GroupHead = Group.querySelector('.ohhai-group-header');
		var GroupName = Group.querySelector('.ohhai-group-txt');
		var ToggleGroup = Group.querySelector('.ohhai-togglegroup');
		var GroupChildren = Group.querySelector('.ohhai-group-children');

		ToggleGroup.addEventListener('click', function (e) {
			$(GroupChildren).toggle();
		});
		GroupName.addEventListener('change', function () {
			Groups.Upsert(Group.id, GroupName.value, function (id) {});
		});
		GroupHead.addEventListener('contextmenu', (e) => {
			e.preventDefault();
			var GroupMenu = OhHaiBrowser.ui.contextmenus.group(Group, GroupChildren);
			GroupMenu.popup(remote.getCurrentWindow());
		}, false);

		if (typeof callback == 'function') {
			callback(Group);
		}
	}
};

const Tabs = {
	count: 0,
	add: function (_URL, _ID, _OPTIONS, callback) {
		let IsNew = false;
		if (_ID == undefined) {
			_ID = CoreFunctions.generateId();
			IsNew = true;
		}

		Templates.websession(_ID, _URL, function (NewWS) {
			//Add fuctionality
			AddListeners(NewWS.webview, NewWS.tab, _ID);

			//Are there options?
			if (_OPTIONS) {
				if (_OPTIONS.selected == true) {
					Tabs.setCurrent(NewWS.tab, NewWS.webview);
				}
				if (_OPTIONS.mode) {
					switch (_OPTIONS.mode.toString().toLowerCase()) {
					case 'dock':
						Tabbar.pinnedtabcontainer.appendChild(NewWS.tab);
						break;
					case 'incog':
						NewWS.tab.classList.add('IncognitoTab');
						Tabbar.tabcontainer.appendChild(NewWS.tab);
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
								Tabbar.tabcontainer.appendChild(NewWS.tab);
							}
						} else {
							_OPTIONS.parent.appendChild(NewWS.tab);
						}
						break;
					case 'default':
					default:
						Tabbar.tabcontainer.appendChild(NewWS.tab);
					}
				} else {
					_OPTIONS.mode = 'default';
					Tabbar.tabcontainer.appendChild(NewWS.tab);
				}
				if (_OPTIONS.title) {
					var tabTxt = NewWS.tab.querySelector('.ohhai-tab-txt');
					tabTxt.textContent = _OPTIONS.title;
				}
				if (_OPTIONS.favicon) {
					var tabFav = NewWS.tab.querySelector('.ohhai-tab-fav');
					tabFav.src = _OPTIONS.favicon;
				}
			} else {
				//load basic defaults
				Tabbar.tabcontainer.appendChild(NewWS.tab);
			}
			Tabbar.webviewcontainer.appendChild(NewWS.webview);

			if (!NewWS.tab.classList.contains('IncognitoTab')) {
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

					Sessions.Set(_ID, 'default', 'TempTitle', _OPTIONS.mode, 'system_assets/icons/logo.png', function (id) {
						if (id != null) {
							NewWS.tab.setAttribute('data-session', _ID);
							Sessions.UpdateParent(_ID, TabParent, function (id) {});
						}
					});
				} else {
					NewWS.tab.setAttribute('data-session', _ID);
				}
			}

			Tabs.count++;
			OhHaiBrowser.ui.navbar.updateTabCounter();

			if (typeof callback === 'function') {
				callback(NewWS);
			}
		});
	},
	remove: function (_TAB, callback) {
		var ThisWebView = document.getElementById(_TAB.getAttribute('data-container'));
		var Parent = _TAB.parentElement;
		var webviewParent = document.getElementById('BrowserWin');

		if (Tabs.count > 1) {
			if (Tabs.isCurrent(_TAB)) {
				var Open_Tabs = document.querySelectorAll('li.tab');
				var This_TabIndex;
				Open_Tabs.forEach(function (ArrayElement, index) {
					if (ArrayElement == _TAB) {
						This_TabIndex = index;
					}
				});

				if ((Open_Tabs.length - 1) == This_TabIndex) {
					//Go in a tab
					Tabs.setCurrent(Open_Tabs[This_TabIndex - 1], null, null);
				} else {
					//Select next tab
					Tabs.setCurrent(Open_Tabs[This_TabIndex + 1], null, null);
				}

				//need to update the URL now
				Tabs.getCurrent(function (NewTab) {
					var newWebview = document.getElementById(NewTab.getAttribute('data-container'));
					OhHaiBrowser.ui.navbar.updateURLBar(newWebview);
				});
			}

		}

		Parent.removeChild(_TAB);
		webviewParent.removeChild(ThisWebView);

		if (Parent.classList.contains('ohhai-group-children')) {
			var ThisGroup = Parent.parentElement;
			if (Parent.children.length == 0) {
				Tabs.groups.remove(ThisGroup, null, null);
			}
		}
		Tabs.count--;
		OhHaiBrowser.ui.navbar.updateTabCounter();

		if (Tabs.count == 0) {
			Tabs.add(OhHaiBrowser.settings.homepage, undefined, {
				selected: true
			});
		}

		if (!_TAB.classList.contains('IncognitoTab')) {
			Sessions.Remove(_TAB.getAttribute('data-session'), function (result) {});
		}

		if (typeof callback == 'function') {
			callback(true);
		}
	},
	get: function (tabid, callback) {
		callback(tabEl.querySelector('#' + tabid));
	},
	isCurrent: function (_Tab) {
		var x = document.getElementsByClassName('current')[0];
		if (_Tab == x) {
			return true;
		} else {
			return false;
		}
	},
	getCurrent: function (callback) {
		var x = document.getElementsByClassName('current');
		if (typeof callback === 'function') {
			callback(x[0]);
		}
	},
	setCurrent: function (tab, webview, callback) {
		Tabs.getCurrent(function (ctab) {
			if (ctab) {
				ctab.classList.remove('current');
				var oldtabwv = document.getElementById(ctab.getAttribute('data-container'));
				oldtabwv.classList.add('Hidden');
			}
		});
		var tabwv = document.getElementById(tab.getAttribute('data-container'));
		tab.classList.add('current');
		if (webview != null) {
			webview.classList.remove('Hidden');
		} else {
			tabwv.classList.remove('Hidden');
		}

		if (typeof callback === 'function') {
			callback(true);
		}
	},
	ismode: function (_tab, _mode, callback) {
		var returnval = false;
		switch (_mode) {
		case 'docked':
			if (_tab.parentNode.id == 'tabs-dock') {
				returnval = true;
			}
			break;
		case 'grouped':
			if (_tab.parentNode.className == 'ohhai-group-children') {
				returnval = true;
			}
			break;
		case 'default':
		default:
			if (_tab.parentNode.id == 'tabs-menu') {
				returnval = true;
			}
		}
		if (typeof callback == 'function') {
			callback(returnval);
		}
	},
	setMode: function (_tab, _mode, callback) {
		var TabSessionId = _tab.getAttribute('data-session');
		var Tab_Text = _tab.querySelector('.ohhai-tab-txt');
		var Tab_CloseBtn = _tab.querySelector('.TabClose');

		switch (_mode) {
		case 'docked':
			Tab_Text.style.display = 'none';
			Tab_CloseBtn.style.display = 'none';
			Tabbar.pinnedtabcontainer.appendChild(_tab);
			Sessions.UpdateMode(TabSessionId, 'DOCK', function () {});
			Sessions.UpdateParent(TabSessionId, Tabbar.pinnedtabcontainer.id, function () {});
			break;
		case 'grouped':

			break;
		case 'default':
		default:
			Tab_Text.style.display = 'block';
			Tab_CloseBtn.style.display = 'block';
			tabbar.tabcontainer.appendChild(_tab);
			Sessions.UpdateMode(TabSessionId, 'Default', function () {});
			Sessions.UpdateParent(TabSessionId, Tabbar.tabcontainer.id, function () {});
		}
	},
	executeScript: function (tabid, code, callback) {
		Tabs.get(tabid, function (cTab) {
			var CurrentWebView = document.getElementById(cTab.getAttribute('data-container'));
			CurrentWebView.executeJavaScript(code);
		});
		callback('request sent');
	},
	insertCSS: function (tabid, code, callback) {
		Tabs.get(tabid, function (cTab) {
			var CurrentWebView = document.getElementById(cTab.getAttribute('data-container'));
			CurrentWebView.insertCSS(code);
		});
		callback('request sent');
	},
	reload: function (tabid, callback) {
		Tabs.get(tabid, function (cTab) {
			var CurrentWebView = document.getElementById(cTab.getAttribute('data-container'));
			CurrentWebView.reload();
		});
		callback('request sent');
	},
	groups: {
		add: function (_id, _title, _tab, callback) {
			var this_group;
			if (_id == null) {
				_id = 'group-' + CoreFunctions.generateId();
			}
			Templates.group(_id, _title, function (newGroup) {
				this_group = newGroup;
				var this_groupChildren = this_group.querySelector('.ohhai-group-children');
				var this_groupName = this_group.querySelector('.ohhai-group-txt');

				switch (_tab) {
				case null:
					//tabs.add('default','default',null,GroupChildren);
					Tabs.add(OhHaiBrowser.settings.homepage, undefined, {
						selected: true,
						mode: 'grouped',
						parent: this_groupChildren
					});
					break;
				case 'session':
					break;
				default:
					var TabSessionId = _tab.getAttribute('data-session');
					this_groupChildren.appendChild(_tab);
					Sessions.UpdateParent(TabSessionId, this_group.id, function (_id) {

					});
				}
				Tabbar.tabcontainer.appendChild(this_group);

				Groups.Upsert(this_group.id, this_groupName.value, function (_id) {});
			});

			if (typeof callback == 'function') {
				callback(this_group);
			}

		},
		remove: function (_Group, _Options, callback) {
			var GroupTabs = _Group.querySelector('.ohhai-group-children');
			var GroupParent = _Group.parentElement;

			//Does the group still have children?
			var GroupChildTabs = GroupTabs.children;
			if (GroupChildTabs.length != 0) {
				for (let index = 0; index < GroupChildTabs.length; ++index) {
					if (_Options.keepChildren) {
						Tabs.groups.removeTab(GroupChildTabs[index]);
					} else {
						Tabs.remove(GroupChildTabs[index]);
					}
				}
			}

			GroupParent.removeChild(_Group);

			Groups.Remove(_Group.id, function (result) {});

			if (typeof callback == 'function') {
				callback(true);
			}
		},
		addTab: function (_tab, _group, callback) {
			if (_group == null) {
				//New Group
				Tabs.groups.add(null, null, _tab);
			} else {
				//Existing group
				var GroupChildren = _group.querySelector('.ohhai-group-children');
				GroupChildren.appendChild(_tab);

				var TabSessionId = _tab.getAttribute('data-session');
				Sessions.UpdateParent(TabSessionId, _group.id, function (id) {});
				Sessions.UpdateMode(TabSessionId, 'grouped', function (id) {});
			}
			if (typeof callback == 'function') {
				callback(true);
			}
		},
		removeTab: function (_tab, callback) {
			var thisGroupList = _tab.parentElement;
			var thisGroup = thisGroupList.parentElement;

			Tabbar.tabcontainer.appendChild(_tab);

			var TabSessionId = _tab.getAttribute('data-session');
			Sessions.UpdateParent(TabSessionId, Tabbar.tabcontainer.id, function (id) {});
			Sessions.UpdateMode(TabSessionId, 'default', function (id) {});

			if (thisGroupList.children.length == 0) {
				Tabs.remove(thisGroup);
			}
			if (typeof callback == 'function') {
				callback(true);
			}
		}
	},
	activePage: {
		getURL: function (callback) {
			Tabs.getCurrent(function (cTab) {
				var CurrentWebView = document.getElementById(cTab.getAttribute('data-container'));
				if (typeof callback == 'function') {
					callback(CurrentWebView.getURL());
				} else {
					return CurrentWebView.getURL();
				}
			});
		},
		getTitle: function (callback) {
			Tabs.getCurrent(function (cTab) {
				var CurrentWebView = document.getElementById(cTab.getAttribute('data-container'));
				if (typeof callback == 'function') {
					callback(CurrentWebView.getTitle());
				} else {
					return CurrentWebView.getTitle();
				}
			});
		},
		goBack: function (callback) {
			Tabs.getCurrent(function (cTab) {
				var CurrentWebView = document.getElementById(cTab.getAttribute('data-container'));
				CurrentWebView.goBack();
			});
			if (typeof callback == 'function') {
				callback('request sent');
			}
		},
		goForward: function (callback) {
			Tabs.getCurrent(function (cTab) {
				var CurrentWebView = document.getElementById(cTab.getAttribute('data-container'));
				CurrentWebView.goForward();
			});
			if (typeof callback == 'function') {
				callback('request sent');
			}
		},
		reload: function (callback) {
			Tabs.getCurrent(function (cTab) {
				var CurrentWebView = document.getElementById(cTab.getAttribute('data-container'));
				CurrentWebView.reload();
			});
			if (typeof callback == 'function') {
				callback('request sent');
			}
		},
		navigate: function (url, callback) {
			Tabs.getCurrent(function (cTab) {
				var CurrentWebView = document.getElementById(cTab.getAttribute('data-container'));
				CurrentWebView.loadURL(url);
			});
			if (typeof callback == 'function') {
				callback('request sent');
			}
		},
		insertCSS: function (code, callback) {
			Tabs.getCurrent(function (cTab) {
				var CurrentWebView = document.getElementById(cTab.getAttribute('data-container'));
				CurrentWebView.insertCSS(code);
			});
			if (typeof callback == 'function') {
				callback('request sent');
			}
		},
		executeJavaScript: function (code, callback) {
			Tabs.getCurrent(function (cTab) {
				var CurrentWebView = document.getElementById(cTab.getAttribute('data-container'));
				CurrentWebView.executeJavaScript(code);
			});
			if (typeof callback == 'function') {
				callback('request sent');
			}
		},
		hasSibling: function () {
			var Sibling = null;
			Tabs.getCurrent(function (cTab) {
				if (cTab.nextSibling) {
					Sibling = {
						'sibling': cTab.nextSibling,
						'location': 'next'
					};
				} else if (cTab.previousSibling) {
					Sibling = {
						'sibling': cTab.previousSibling,
						'location': 'last'
					};
				}
			});
			return Sibling;
		}
	},
	popupwindow: function (params, callback) {
		//This is a pop up window - Does the user want this pop up, does it have a parent control? 
		const remote = require('electron').remote;
		const BrowserWindow = remote.BrowserWindow;
		var win = new BrowserWindow({
			width: 800,
			height: 600,
			frame: false,
			icon: `${__dirname}/window/assets/OhHaiIcon.ico`,
			show: false
		});
		win.webContents.on('did-finish-load', () => {
			win.show();
			win.focus();
		});
		win.loadURL(`file://${__dirname}/system_assets/components/pop_out_window/template.html?url=${params.url}`);

		callback(win);
	}
}

module.exports = Tabs;
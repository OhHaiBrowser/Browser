let CoreFunctions = require('./OhHaiBrowser.Core'),
	{Sessions, Groups} = require('./OhHaiBrowser.Data'),
	AddListeners = require('./../components/tab_views/script'),
	Tabbar = require('./OhHaiBrowser.Tabbar'),
	{remote} = require('electron'),
	{functions} = require('./../components/nav_bar/controls.js');


class OhHaiWebSession {
	constructor(id,url,opts){
		this.id = id;
		this.tab =CoreFunctions.generateElement(`
			<li class='tab' id='t_${id}' data-container='wv_${id}'>
				<a class='tabMediaBtn hidden'></a>
				<img class='ohhai-tab-fav' src='system_assets/icons/logo.png'/>
				<span class='ohhai-tab-txt'>New Tab</span>
				<a class='TabClose'></a>
			</li>`);
		this.webview =  CoreFunctions.generateElement(`<webview id='wv_${id}' src='${parseOpenPage(url)}' class='Hidden'></webview>`);
		if (opts) {
			if (opts.mode) {
				this.mode = String(opts.mode);
			}
			if (opts.title) {
				var tabTxt = this.tab.querySelector('.ohhai-tab-txt');
				tabTxt.textContent = String(opts.title);
			}
			if (opts.favicon) {
				var tabFav = this.tab.querySelector('.ohhai-tab-fav');
				tabFav.src = String(opts.favicon);
			}
		}
		AddListeners(this);
	}
	/**
	 * @param {string} value
	 */
	set mode(value){
		switch(value){
		case 'incog':
			this.tab.classList.add('IncognitoTab');
			break;
		case 'dock':
			this.tab.querySelector('.ohhai-tab-txt').style.display = 'none';
			this.tab.querySelector('.TabClose').style.display = 'none';
			break;
		case 'default':
		default:
			this.tab.querySelector('.ohhai-tab-txt').style.display = 'block';
			this.tab.querySelector('.TabClose').style.display = 'block';
		}
	}
	get mode(){
		return this.tab.classList.contains('IncognitoTab') ? 'incog' :
			this.tab.querySelector('.ohhai-tab-txt').style.display == 'none' ? 'dock' :
				'default';
	}

	/**
	 * @param {boolean} value
	 */
	set selected(value){
		if(value){
			this.tab.classList.add('current');
			this.webview.classList.remove('Hidden');
		}else{
			this.tab.classList.remove('current');
			this.webview.classList.add('Hidden');
		}
	}
	get selected(){
		return this.tab.classList.contains('current');
	}

}
function parseOpenPage(url){
	switch (url) {
	case 'default':
	case undefined:
	case '':
		return `system_assets/components/home_page/index.html`;
	default:
		return url;
	}
}

class OhHaiGroup {
	constructor(id,title){
		this.id = id;
		this.Group = CoreFunctions.generateElement(`
			<li class='group' id='${id}'>
				<div class='ohhai-group-header'>
					<input type='text' class='ohhai-group-txt' value='${title != null ? title : 'New Group'}'/>
					<a class='ohhai-togglegroup'></a>
				</div>
				<ul class='ohhai-group-children'>
				</ul>
			</li>`);

		var GroupHead = this.Group.querySelector('.ohhai-group-header');
		var GroupName = this.Group.querySelector('.ohhai-group-txt');
		var ToggleGroup = this.Group.querySelector('.ohhai-togglegroup');
		var GroupChildren = this.Group.querySelector('.ohhai-group-children');

		ToggleGroup.addEventListener('click', function (e) {
			$(GroupChildren).toggle();
		});
		GroupName.addEventListener('change', function () {
			Groups.Upsert(this.id, GroupName.value, function (id) {});
		});
		GroupHead.addEventListener('contextmenu', (e) => {
			e.preventDefault();
			var GroupMenu = OhHaiBrowser.ui.contextmenus.group(this.Group, GroupChildren);
			GroupMenu.popup(remote.getCurrentWindow());
		}, false);
	}
	set title(value){
		var GroupName = this.Group.querySelector('.ohhai-group-txt');
		GroupName.value = value;
	}
	get title(){
		var GroupName = this.Group.querySelector('.ohhai-group-txt');
		return GroupName.value;
	}

	get children(){
		return this.Group.querySelector('.ohhai-group-children');
	}
}

const Tabs = {
	count: 0,
	tabMap: new Array(),
	add: function (_URL, _ID, _OPTIONS, callback) {
		let IsNew = false;
		if (_ID == undefined) {
			_ID = CoreFunctions.generateId();
			IsNew = true;
		}

		let NewWS = new OhHaiWebSession(_ID, _URL, _OPTIONS);

		//Are there options?
		if (_OPTIONS) {
			if (_OPTIONS.selected == true) {
				Tabs.setCurrent(NewWS);
			}
			if (_OPTIONS.mode) {
				switch (_OPTIONS.mode.toString().toLowerCase()) {
				case 'dock':
					Tabbar.pinnedtabcontainer.appendChild(NewWS.tab);
					break;
				case 'incog':
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
		} else {
			//load basic defaults
			Tabbar.tabcontainer.appendChild(NewWS.tab);
		}
		Tabbar.webviewcontainer.appendChild(NewWS.webview);

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

		Tabs.tabMap.push(NewWS);
		Tabs.count++;
		functions.updateTabCounter();

		if (typeof callback === 'function') {
			callback(NewWS);
		}
	},
	remove: function (_webSession, callback) {

		var Parent = _webSession.tab.parentElement;
		var webviewParent = document.getElementById('BrowserWin');

		if (Tabs.count > 1) {
			if (_webSession.selected) {
				var Open_Tabs = document.querySelectorAll('li.tab');
				var This_TabIndex;
				Open_Tabs.forEach(function (ArrayElement, index) {
					if (ArrayElement == _webSession.tab) {
						This_TabIndex = index;
					}
				});

				if ((Open_Tabs.length - 1) == This_TabIndex) {
					//Go in a tab
					let thisSession = Tabs.tabMap.find(i => i.tab == Open_Tabs[This_TabIndex - 1]);
					Tabs.setCurrent(thisSession, null, null);
				} else {
					//Select next tab
					let thisSession = Tabs.tabMap.find(i => i.tab == Open_Tabs[This_TabIndex + 1]);
					Tabs.setCurrent(thisSession, null, null);
				}

				//need to update the URL now
				Tabs.getCurrent(function (session) {
					functions.updateURLBar(session.webview);
				});
			}
		}

		Parent.removeChild(_webSession.tab);
		webviewParent.removeChild(_webSession.webview);

		if (Parent.classList.contains('ohhai-group-children')) {
			var ThisGroup = Parent.parentElement;
			if (Parent.children.length == 0) {
				Tabs.groups.remove(ThisGroup, null, null);
			}
		}
		
		Tabs.count--;
		Tabs.tabMap.splice(Tabs.tabMap.findIndex(i => i.id == _webSession.id) ,1);

		functions.updateTabCounter();

		if (Tabs.count == 0) {
			Tabs.add('default', undefined, {
				selected: true
			});
		}

		if (_webSession.mode != 'incog') {
			Sessions.Remove(_webSession.id, function (result) {});
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
		let currentWebSession = Tabs.tabMap.find(i => i.selected === true);
		callback(currentWebSession);
	},
	setCurrent: function (_WebSession, callback) {

		Tabs.getCurrent(function (ctab) {
			if(ctab){
				ctab.selected = false;
			}
		});

		_WebSession.selected = true;

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
			Tabbar.tabcontainer.appendChild(_tab);
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
			if (_id == null) {
				_id = 'group-' + CoreFunctions.generateId();
			}

			let NewG = new OhHaiGroup(_id, _title);

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
				Sessions.UpdateParent(TabSessionId, NewG.id, function (_id) {

				});
			}
			Tabbar.tabcontainer.appendChild(NewG.Group);

			Groups.Upsert(NewG.id, NewG.title, function (_id) {});

			if (typeof callback == 'function') {
				callback(NewG.group);
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
			Tabs.getCurrent(function (cSession) {
				if (typeof callback == 'function') {
					callback(cSession.webview.getURL());
				} else {
					return cSession.webview.getURL();
				}
			});
		},
		getTitle: function (callback) {
			Tabs.getCurrent(function (cSession) {
				if (typeof callback == 'function') {
					callback(cSession.webview.getTitle());
				} else {
					return cSession.webview.getTitle();
				}
			});
		},
		goBack: function (callback) {
			Tabs.getCurrent(function (cSession) {
				cSession.webview.goBack();
			});
			if (typeof callback == 'function') {
				callback('request sent');
			}
		},
		goForward: function (callback) {
			Tabs.getCurrent(function (cSession) {
				cSession.webview.goForward();
			});
			if (typeof callback == 'function') {
				callback('request sent');
			}
		},
		reload: function (callback) {
			Tabs.getCurrent(function (cSession) {
				cSession.webview.reload();
			});
			if (typeof callback == 'function') {
				callback('request sent');
			}
		},
		navigate: function (url, callback) {
			Tabs.getCurrent(function (cSession) {
				cSession.webview.loadURL(url);
			});
			if (typeof callback == 'function') {
				callback('request sent');
			}
		},
		insertCSS: function (code, callback) {
			Tabs.getCurrent(function (cSession) {
				cSession.webview.insertCSS(code);
			});
			if (typeof callback == 'function') {
				callback('request sent');
			}
		},
		executeJavaScript: function (code, callback) {
			Tabs.getCurrent(function (cSession) {
				cSession.webview.executeJavaScript(code);
			});
			if (typeof callback == 'function') {
				callback('request sent');
			}
		},
		hasSibling: function () {
			var Sibling = null;
			Tabs.getCurrent(function (cSession) {
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
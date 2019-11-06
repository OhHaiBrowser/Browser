var {clipboard,	remote} = require('electron'),
	{Menu,	MenuItem} = remote,
	{Quicklinks, Settings, Sessions} = require('./system_assets/modules/OhHaiBrowser.Data.js'),
	HistoryList = require('./system_assets/scripts/addons/history.js'),
	BookmarksList = require('./system_assets/scripts/addons/bookmarks.js'),
	{functions, controls, AutoComplete} = require('./services/navbar.service.js'),
	{tabs} = require('./services/tabs.service.js'),
	tabbar = require('./system_assets/modules/OhHaiBrowser.Tabbar.js'),
	AboutMenu = require('./system_assets/scripts/addons/about.js'),
	SettingsMenu = require('./system_assets/scripts/addons/settings.js'),
	Contextuals = require('./system_assets/modules/Contextuals/Contextuals.js');

var OhHaiBrowser = {
	sessionStartTime: '',
	sessionDuration: function () {
		return Date.now() - OhHaiBrowser.sessionStartTime;
	},
	tabs: tabs,
	session: {
		list: function (callback){
			Sessions.Get(function (slist) {
				if (typeof callback === 'function') {
					callback(slist);
				}
			});
		}
	},
	history: {
		container: document.getElementById('HistoryContainer'),
		load: () => {
			OhHaiBrowser.history.container.appendChild(HistoryList());
		}
	},
	bookmarks: {
		container: document.getElementById('BookmarkContainer'),
		btn_bookmark: document.getElementById('BtnQuicklink'),
		load: () => {
			OhHaiBrowser.bookmarks.container.appendChild(BookmarksList());
		},
		add: function (bookmarkName, bookmarkUrl, bookmarkIcon, bookmarkDesc, popuplocal, callback) {

			let BookmarkPopup = OhHaiBrowser.core.generateElement(`
			<div class='bookmark_popup' style='left:${(popuplocal.left - 249)};top:${(popuplocal.top + 23)};'>
				<p class='bookmark_title'>New bookmark</p>
				<input type='text' class='bookmark_nametxt' value='${bookmarkName}'>
				<input type='button' class='bookmark_add' value='Add'>
				<input type='button' class='bookmark_cancel' value='Cancel'>
			</div>`);

			var Txt_Url = BookmarkPopup.querySelector('.bookmark_nametxt');
			var Add_bookmark = BookmarkPopup.querySelector('.bookmark_add');
			var Cancel_bookmark = BookmarkPopup.querySelector('.bookmark_cancel');

			Add_bookmark.addEventListener('click', function (e) {
				Quicklinks.Add(bookmarkUrl, Txt_Url.value, bookmarkIcon, '', bookmarkDesc, function (newqlink) {
					var ReturnVal = ((newqlink != 0 || -1) ? newqlink : null);
					if (ReturnVal != null) {
						OhHaiBrowser.bookmarks.btn_bookmark.setAttribute('data-id', newqlink);
						OhHaiBrowser.bookmarks.btn_bookmark.classList.remove('QuicklinkInactive');
						OhHaiBrowser.bookmarks.btn_bookmark.classList.add('QuicklinkActive');
					} else {
						//Error
					}
					BookmarkPopup.parentNode.removeChild(BookmarkPopup);
				});
			});

			Cancel_bookmark.addEventListener('click', function (e) {
				BookmarkPopup.parentNode.removeChild(BookmarkPopup);
			});

			document.body.appendChild(BookmarkPopup);

			callback('done');
		},
		remove: function (bookmarkId, callback) {
			if (typeof callback === 'function') {
				callback();
			}
		},
		check: function (url, callback) {
			Quicklinks.IsBookmarked(url, function (item) {
				var ReturnVal = '';
				if (item != undefined) {
					//This is a Qlink
					ReturnVal = item.id;
				} else {
					//Default state
					ReturnVal = null;
				}
				if (typeof callback === 'function') {
					callback(ReturnVal);
				}
			});
		},
		updateBtn: function (ReturnVal, callback) {
			if (ReturnVal != null) {
				OhHaiBrowser.bookmarks.btn_bookmark.setAttribute('data-id', ReturnVal);

				OhHaiBrowser.bookmarks.btn_bookmark.classList.remove('QuicklinkInactive');
				OhHaiBrowser.bookmarks.btn_bookmark.classList.add('QuicklinkActive');
			} else {
				//Default state
				OhHaiBrowser.bookmarks.btn_bookmark.classList.remove('QuicklinkActive');
				OhHaiBrowser.bookmarks.btn_bookmark.classList.add('QuicklinkInactive');

				OhHaiBrowser.bookmarks.btn_bookmark.setAttribute('data-id', '');
			}
			if (typeof callback === 'function') {
				callback('complete');
			}
		}
	},
	settings: {
		homepage: '',
		search: '',
		generic: function (settingName, callback) {
			Settings.Get(settingName, (genericItem) => {
				if (genericItem != undefined) {
					callback(genericItem.value);
				} else {
					callback(null);
				}
			});
		}
	},
	ui: {
		videoPlayer: function (params, callback) {
			//This is a pop up window - Does the user want this pop up, does it have a parent control? 
			const remote = require('electron').remote;
			const BrowserWindow = remote.BrowserWindow;
			var win = new BrowserWindow({
				width: 534,
				height: 300,
				frame: false,
				minimizable: false,
				maximizable: false,
				fullscreenable: false,
				alwaysOnTop: true,
				icon: `file://${__dirname}/assets/imgs/frame/icon.png`,
				show: false
			});
			win.webContents.on('did-finish-load', () => {
				win.show();
				win.focus();
			});
			win.loadURL(`file://${__dirname}/components/pop_out_player/template.html?url=${params.url}`);
			win.webContents.openDevTools();
			if (typeof callback === 'function') {
				callback(win);
			}
		},
		notifications: {
			post: function (notificationText, callback) {
				if (typeof callback === 'function') {
					callback();
				}
			},
			remove: function (notificationId, callback) {
				if (typeof callback === 'function') {
					callback();
				}
			}
		},
		theme: {
			load: function (stylesheet, callback) {
				var ThemeCss = document.getElementById('ThemeStyle');
				if (ThemeCss != null) {
					ThemeCss.setAttribute('href', stylesheet);
					if (typeof callback === 'function') {
						callback(true);
					}
				}
			}
		},
		contextmenus: {
			urlbar: (URLBar) => {
				var URlMenu = new Menu();
				URlMenu.append(new MenuItem({
					label: 'Copy title',
					click() {
						OhHaiBrowser.tabs.activePage.getTitle(Pt => clipboard.writeText(Pt));
					}
				}));
				URlMenu.append(new MenuItem({
					label: 'Copy URL',
					click() {
						OhHaiBrowser.tabs.activePage.getURL(Purl => clipboard.writeText(Purl));
					}
				}));
				URlMenu.append(new MenuItem({
					label: 'Paste',
					click() {
						OhHaiBrowser.ui.navbar.txt_urlBar.value = clipboard.readText();
					}
				}));
				return URlMenu;
			},
			quicklink: function (Id, Name, Url, Item) {
				var NewMenu = new Menu();
				NewMenu.append(new MenuItem({
					label: 'Open',
					click() {
						OhHaiBrowser.tabs.activePage.navigate(Url);
					}
				}));
				NewMenu.append(new MenuItem({
					label: 'Open in new tab',
					click() {
						OhHaiBrowser.tabs.add(Url, undefined, {
							selected: true
						});
					}
				}));
				NewMenu.append(new MenuItem({
					type: 'separator'
				}));
				NewMenu.append(new MenuItem({
					label: 'Delete',
					click() {
						Quicklinks.Remove(Id, function (recordsdeleted) {
							if (recordsdeleted != 0 || undefined) {
								Item.parentNode.removeChild(Item);
							} else {
								//Error?
							}
						});
					}
				}));
				return NewMenu;
			}
		},
		navbar: functions,
		tabbar: require('./system_assets/modules/OhHaiBrowser.Tabbar.js'),
		wcm: {
			template: `
				<div class='WMC_popup'>
					<span class='WCM_msg'></span>
					<input type='button' class='WCM_close' value='X'/>
				</div>`,
			post: function (msg, onclick_func) {
				var this_WCM = OhHaiBrowser.core.generateElement(this.template);

				this_WCM.querySelector('.WCM_msg').textContent = msg;
				this_WCM.querySelector('.WCM_close').addEventListener('click', function () {
					this_WCM.classList.remove('WMC_Show');
					setTimeout(function () {
						this_WCM.remove();
					}, 800);
				});
				this_WCM.querySelector('.WCM_msg').addEventListener('click', function () {
					this_WCM.classList.remove('WMC_Show');
					setTimeout(function () {
						this_WCM.remove();
					}, 800);
					onclick_func();
				});

				document.body.appendChild(this_WCM);
				setTimeout(function () {
					this_WCM.classList.add('WMC_Show');
				}, 10);

				//auto close after 5 seconds
				setTimeout(function () {
					this_WCM.classList.remove('WMC_Show');
					setTimeout(function () {
						this_WCM.remove();
					}, 800);
				}, 5000);

			}
		},
		toggleModel: (content, menuTitle) => {
			let mainWin = document.getElementById('AppBound');
			let bgWin = document.getElementById('BlurBg');
			let modelPopup = document.getElementById('modelPopup');
			let modelTitle =modelPopup.querySelector('.modeltitle');
			let modelContent = document.getElementById('modelContent');
			
			let modelClose = modelPopup.querySelector('.modelClose');
			modelClose.addEventListener('click',() => {
				OhHaiBrowser.ui.toggleModel('','');
			});

			if(bgWin.getAttribute('style') == 'display:none;'){
				//Show window
				mainWin.classList.add('blurBrowser');
				bgWin.setAttribute('style','display:block;');
				modelTitle.textContent = menuTitle;
				modelContent.appendChild(content);
				modelPopup.setAttribute('style','display:block;');
			}else{
				//Hide window
				mainWin.classList.remove('blurBrowser');
				bgWin.setAttribute('style','display:none;');
				modelPopup.setAttribute('style','display:none;');
				modelContent.removeChild(modelContent.lastChild);
			}
		}
	},
	toggleLock: function () {
		if (OhHaiBrowser.isLocked) {

		} else {

		}
	},
	isLocked: false,
	about: {
		onlineStatus: function (callback) {
			if (typeof callback === 'function') {
				callback();
			}
		},
		version: {
			full: function (callback) {
				if (typeof callback === 'function') {
					callback();
				}
			},
			platform: function (callback) {
				if (typeof callback === 'function') {
					callback();
				}
			},
			major: function (callback) {
				if (typeof callback === 'function') {
					callback();
				}
			},
			minor: function (callback) {
				if (typeof callback === 'function') {
					callback();
				}
			},
			build: function (callback) {
				if (typeof callback === 'function') {
					callback();
				}
			}
		}
	},
	validate: require('./system_assets/modules/OhHaiBrowser.Validation.js'),
	core: require('./system_assets/modules/OhHaiBrowser.Core.js')
};

//Ui Functions
controls.btn_ToggleTabBar.addEventListener('click', tabbar.toggle );
controls.btn_back.addEventListener('click', tabs.activePage.goBack );
controls.btn_refresh.addEventListener('click', tabs.activePage.reload );
controls.btn_forward.addEventListener('click', tabs.activePage.goForward );

tabs._count.asObservable().subscribe((val) => {
	console.log(val);
});

tabbar.panel.addEventListener('contextmenu', (e) => {
	switch (e.target.className) {
	case 'CommandBtn AddTab':
	case 'OhHai-TabMenu':
		//Everythig which isnt a tab
		var TbMen = tabbar.contextMenu();
		e.preventDefault();
		TbMen.popup(remote.getCurrentWindow());
		break;
	}
}, false);

function AddTabButton() {
	tabs.add(OhHaiBrowser.settings.homepage, undefined, {
		selected: true
	});
}

controls.txt_urlbar.addEventListener('contextmenu', (e) => {
	e.preventDefault();
	var URlMenu = OhHaiBrowser.ui.contextmenus.urlbar(controls.txt_urlbar);
	URlMenu.popup(remote.getCurrentWindow());
}, false);

let urlbarValid = {};
controls.txt_urlbar.addEventListener('keydown', function (event) {
//Check validity of URL content
	AutoComplete(this.value, (resp) => {
		urlbarValid = resp;
	});
	//On Enter
	if (event.which == 13) {
		tabs.activePage.navigate(urlbarValid.output);
	}
});

controls.txt_urlbar.addEventListener('click', () => {
	if (controls.txt_urlbar.value != controls.txt_urlbar.getAttribute('data-text-swap')) {
		controls.txt_urlbar.value = controls.txt_urlbar.getAttribute('data-text-swap');
	}
});

controls.txt_urlbar.addEventListener('focus', () => {
	controls.div_urlOuter.classList.add('CenterFocus');
});

controls.txt_urlbar.addEventListener('focusout', () => {
	controls.txt_urlbar.value = controls.txt_urlbar.getAttribute('data-text-original');
	controls.div_urlOuter.classList.remove('CenterFocus');
});

controls.btn_bookmarked.addEventListener('click', function (e) {
	var popuplocation = {
		'left': e.currentTarget.offsetLeft,
		'top': e.currentTarget.offsetTop
	};
	if (controls.btn_bookmarked.classList.contains('QuicklinkInactive')) {
		//Add new bookmark
		OhHaiBrowser.tabs.getCurrent(function (cSession) {
			OhHaiBrowser.bookmarks.add(cSession.webview.getTitle(), cSession.webview.getURL(), '', '', popuplocation, function (newqlink) {});
		});
	} else {
		//Remove bookmark
		var ThisId = Number(controls.btn_bookmarked.getAttribute('data-id'));
		Quicklinks.Remove(ThisId, function (e) {
			if (e != 0) {
				controls.btn_bookmarked.setAttribute('data-id', '');
				controls.btn_bookmarked.classList.remove('QuicklinkActive');
				controls.btn_bookmarked.classList.add('QuicklinkInactive');
			}
		});
	}
});

controls.btn_overflow.addEventListener('click',() => {
	new Contextuals.menu([
		{title:'New tab', tip:'', icon:'assets/imgs/transparent.png', onclick:() => {
			tabs.add(OhHaiBrowser.settings.homepage,undefined,{selected: true});
		}},
		{title:'New incognito tab', tip:'', icon:'assets/imgs/transparent.png', onclick:() => {
			tabs.add(OhHaiBrowser.settings.homepage,undefined,{selected: true,mode:'incog'});
		}},
		{seperator:true},
		{title:'Settings', tip:'', icon:'assets/imgs/transparent.png', onclick:() => {
			OhHaiBrowser.ui.toggleModel(SettingsMenu(),'Settings');
		}},
		{title:'About', tip:'', icon:'assets/imgs/transparent.png', onclick:() => {
			OhHaiBrowser.ui.toggleModel(AboutMenu(),'OhHai Browser');
		}}
	]);
});

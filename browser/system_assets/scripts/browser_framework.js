var {clipboard,	remote} = require('electron'),
	{Menu,	MenuItem} = remote,
	{Quicklinks, Settings, Sessions, Groups, History} = require('./system_assets/modules/OhHaiBrowser.Data.js'),
	HistoryList = require('./system_assets/scripts/addons/history.js'),
	BookmarksList = require('./system_assets/scripts/addons/bookmarks.js'),
	{functions} = require('./system_assets/components/nav_bar/controls.js');

var OhHaiBrowser = {
	sessionStartTime: '',
	sessionDuration: function () {
		return Date.now() - OhHaiBrowser.sessionStartTime;
	},
	builtInPages: {
		errorPage: `file://${__dirname}/system_assets/components/error_page/index.html`
	},
	tabs: require('./system_assets/modules/OhHaiBrowser.Tabs.js'),
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
		floatingVidPlayer: function (url, callback) {
			var callbackval = '';
			OhHaiBrowser.validate.url(url, function (isurl) {
				if (isurl == true) {
					OhHaiBrowser.tabs.activePage.executeJavaScript('document.getElementsByTagName(\'video\')[0].pause();');

					$('#VideoPlayer').show();
					$('#VidInner').animate({
						width: 'show'
					}, 150);
					$('#VidFrame').attr('src', url);

					callbackval = 'Done';
				} else {
					//not a valid URL
					callbackval = 'Invalid URL string';
				}
				if (typeof callback === 'function') {
					callback(callbackval);
				}
			});
		},
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
				icon: `${__dirname}/window/assets/OhHaiIcon.ico`,
				show: false
			});
			win.webContents.on('did-finish-load', () => {
				win.show();
				win.focus();
			});
			win.loadURL(`file://${__dirname}/system_assets/components/pop_out_player/template.html?url=${params.url}`);
			win.webContents.openDevTools();
			if (typeof callback === 'function') {
				callback(win);
			}
		},
		closeFloatingVidPlayer: function () {
			$('#VideoPlayer').fadeOut();
			$('#VidFrame').attr('src', '');
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
						OhHaiBrowser.tabs.activePage.getTitle(function (pagetitle) {
							clipboard.writeText(pagetitle);
						});
					}
				}));
				URlMenu.append(new MenuItem({
					label: 'Copy URL',
					click() {
						OhHaiBrowser.tabs.activePage.getURL(function (pageurl) {
							clipboard.writeText(pageurl);
						});
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
			webview: function (ThisWebview, webviewcontent, params) {
				var Web_menu = new Menu();
				if (params.linkURL != '') {
					Web_menu.append(new MenuItem({
						label: 'Open link in new tab',
						click() {
							OhHaiBrowser.tabs.add(params.linkURL, undefined, {
								selected: true
							});
						}
					}));
					Web_menu.append(new MenuItem({
						type: 'separator'
					}));
				}

				if (params.srcURL != '') {
					Web_menu.append(new MenuItem({
						label: 'Open ' + params.mediaType + ' in new tab',
						click() {
							OhHaiBrowser.tabs.add(params.srcURL, undefined, {
								selected: true
							});
						}
					}));
					Web_menu.append(new MenuItem({
						type: 'separator'
					}));
				}

				if (params.selectionText != '' || params.inputFieldType != 'none') {
					Web_menu.append(new MenuItem({
						label: 'Copy',
						click() {
							clipboard.writeText(params.selectionText);
						},
						enabled: params.editFlags.canCopy
					}));
					Web_menu.append(new MenuItem({
						label: 'Paste',
						click() {
							webviewcontent.paste();
						},
						enabled: params.editFlags.canPaste
					}));
					Web_menu.append(new MenuItem({
						type: 'separator'
					}));
					Web_menu.append(new MenuItem({
						label: 'Google search for selection',
						click() {
							OhHaiBrowser.tabs.add(`https://www.google.co.uk/search?q=${params.selectionText}`, undefined, {
								selected: true
							});
						}
					}));
				}

				switch (params.mediaType) {
				case ('image'):
					Web_menu.append(new MenuItem({
						label: 'Copy image',
						click() {
							webviewcontent.copyImageAt(params.x, params.y);
						}
					}));
					break;
				}

				Web_menu.append(new MenuItem({
					label: 'Select all',
					accelerator: 'CmdOrCtrl+A',
					click() {
						webviewcontent.selectAll();
					}
				}));
				Web_menu.append(new MenuItem({
					type: 'separator'
				}));

				Web_menu.append(new MenuItem({
					label: 'Back',
					accelerator: 'Alt+Left',
					click() {
						OhHaiBrowser.tabs.activePage.goBack();
					}
				}));
				Web_menu.append(new MenuItem({
					label: 'Refresh',
					accelerator: 'CmdOrCtrl+R',
					click() {
						OhHaiBrowser.tabs.activePage.reload();
					}
				}));
				Web_menu.append(new MenuItem({
					label: 'Forward',
					accelerator: 'Alt+Right',
					click() {
						OhHaiBrowser.tabs.activePage.goForward();
					}
				}));
				Web_menu.append(new MenuItem({
					type: 'separator'
				}));
				Web_menu.append(new MenuItem({
					label: 'Inspect',
					accelerator: 'CmdOrCtrl+Shift+I',
					click() {
						webviewcontent.inspectElement(params.x, params.y);
					}
				}));

				return Web_menu;
			},
			tab: function (webSession) {

				var NewMenu = new Menu();
				NewMenu.append(new MenuItem({
					label: 'New Tab',
					click() {
						OhHaiBrowser.tabs.add(OhHaiBrowser.settings.homepage, undefined, {
							selected: true
						});
					}
				}));
				NewMenu.append(new MenuItem({
					label: 'New Incognito Tab',
					click() {
						OhHaiBrowser.tabs.add(OhHaiBrowser.settings.homepage, undefined, {
							selected: true,
							mode: 'incog'
						});
					}
				}));
				NewMenu.append(new MenuItem({
					type: 'separator'
				}));
				if (webSession.tab.parentElement.classList.contains('ohhai-group-children')) {
					//This tabs is in a group
					NewMenu.append(new MenuItem({
						label: 'Remove tab from group',
						click() {
							OhHaiBrowser.tabs.groups.removeTab(webSession.tab);
						}
					}));
				} else {
					//This is a standard tab
					var GroupMenu = [new MenuItem({
						label: 'New group',
						click() {
							OhHaiBrowser.tabs.groups.addTab(webSession.tab, null);
						}
					})];
					var CurrentGroups = document.getElementsByClassName('group');
					if (CurrentGroups.length > 0) {
						GroupMenu.push(new MenuItem({
							type: 'separator'
						}));
						for (var i = 0; i < CurrentGroups.length; i++) {
							var ThisGroup = CurrentGroups[i];
							var GroupTitle = ThisGroup.querySelector('.ohhai-group-txt').value;
							GroupMenu.push(new MenuItem({
								label: GroupTitle,
								click() {
									OhHaiBrowser.tabs.groups.addTab(webSession.tab, ThisGroup);
								}
							}));
						}
					}

					NewMenu.append(new MenuItem({
						label: 'Add tab to group',
						type: 'submenu',
						submenu: GroupMenu
					}));
				}
				if (webSession.webview.isAudioMuted() == true) {
					NewMenu.append(new MenuItem({
						label: 'Unmute Tab',
						click() {
							webSession.webview.setAudioMuted(false);
						}
					}));
				} else {
					NewMenu.append(new MenuItem({
						label: 'Mute Tab',
						click() {
							webSession.webview.setAudioMuted(true);
						}
					}));
				}
				OhHaiBrowser.tabs.ismode(webSession.tab, 'docked', function (returnval) {
					if (returnval == true) {
						NewMenu.append(new MenuItem({
							label: 'Undock Tab',
							click() {
								OhHaiBrowser.tabs.setMode(webSession.tab, 'default', function () {});
							}
						}));
					} else {
						NewMenu.append(new MenuItem({
							label: 'Dock Tab',
							click() {
								OhHaiBrowser.tabs.setMode(webSession.tab, 'docked', function () {});
							}
						}));
					}
				});
				NewMenu.append(new MenuItem({
					type: 'separator'
				}));
				NewMenu.append(new MenuItem({
					label: 'Close Tab',
					click() {
						OhHaiBrowser.tabs.remove(webSession);
					}
				}));

				return NewMenu;

			},
			tabmenu: function () {
				var NewMenu = new Menu();
				NewMenu.append(new MenuItem({
					label: 'New Tab',
					click() {
						OhHaiBrowser.tabs.add(OhHaiBrowser.settings.homepage, undefined, {
							selected: true
						});
					}
				}));
				NewMenu.append(new MenuItem({
					label: 'New Incognito Tab',
					click() {
						OhHaiBrowser.tabs.add(OhHaiBrowser.settings.homepage, undefined, {
							selected: true,
							mode: 'incog'
						});
					}
				}));
				NewMenu.append(new MenuItem({
					label: 'New Group',
					click() {
						OhHaiBrowser.tabs.groups.add(null, null, null);
					}
				}));

				return NewMenu;
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
			},
			group: function (Group, GroupChildren) {
				var GroupMenu = new Menu();
				GroupMenu.append(new MenuItem({
					label: 'Add tab to group',
					click() {
						OhHaiBrowser.tabs.add(OhHaiBrowser.settings.homepage, undefined, {
							selected: true,
							mode: 'grouped',
							parent: GroupChildren
						});
					}
				}));
				GroupMenu.append(new MenuItem({
					type: 'separator'
				}));
				GroupMenu.append(new MenuItem({
					label: 'Remove group, keep tabs',
					click() {
						OhHaiBrowser.tabs.groups.remove(Group, {
							keepChildren: true
						});
					}
				}));
				GroupMenu.append(new MenuItem({
					label: 'Remove group and tabs',
					click() {
						OhHaiBrowser.tabs.groups.remove(Group, {
							keepChildren: false
						});
					}
				}));

				return GroupMenu;
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

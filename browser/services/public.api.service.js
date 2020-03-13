const {clipboard, remote} = require('electron');
const {Menu, MenuItem} = remote;
const {tabs} = require('./tabs.service');
const validate = require('../system_assets/modules/OhHaiBrowser.Validation');
const core = require('../system_assets/modules/OhHaiBrowser.Core');
const {Quicklinks, Settings} = require('../system_assets/modules/OhHaiBrowser.Data');
const {functions} = require('./navbar.service');
const {tabbar} = require('./tabbar.service');

module.exports.definePublicAPIs = () => {
	window.OhHaiBrowser = {
		sessionStartTime: '',
		sessionDuration: () => {
			return Date.now() - window.OhHaiBrowser.sessionStartTime;
		},
		tabs,
		bookmarks: {
			add: function (bookmarkName, bookmarkUrl, bookmarkIcon, bookmarkDesc, popuplocal, callback) {

				let BookmarkPopup = core.generateElement(`
				<div class='bookmark_popup' style='left:${(popuplocal.left - 249)};top:${(popuplocal.top + 23)};'>
					<p class='bookmark_title'>New bookmark</p>
					<input type='text' class='bookmark_nametxt' value='${bookmarkName}'>
					<input type='button' class='bookmark_add' value='Add'>
					<input type='button' class='bookmark_cancel' value='Cancel'>
				</div>`);
	
				var Txt_Url = BookmarkPopup.querySelector('.bookmark_nametxt');
				var Add_bookmark = BookmarkPopup.querySelector('.bookmark_add');
				var Cancel_bookmark = BookmarkPopup.querySelector('.bookmark_cancel');
	
				Add_bookmark.addEventListener('click', () => {
					Quicklinks.Add(bookmarkUrl, Txt_Url.value, bookmarkIcon, '', bookmarkDesc).then((newqlink) => {
						let urlBar = document.getElementById('URLBar');
						urlBar.bookmarkId = newqlink;
	
						BookmarkPopup.parentNode.removeChild(BookmarkPopup);
					});
				});
	
				Cancel_bookmark.addEventListener('click', function () {
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
			check: (url, callback) => {
				Quicklinks.IsBookmarked(url).then((id) => {
					if (typeof callback === 'function') {
						callback(id);
					}
				}).catch(() => {
					if (typeof callback === 'function') {
						callback(null);
					}
				});
			},
			updateBtn: function (ReturnVal, callback) {
				if (ReturnVal != null) {
					let urlBar = document.getElementById('URLBar');
					urlBar.bookmarkId = ReturnVal;
				} else {
					//Default state
					let urlBar = document.getElementById('URLBar');
					urlBar.bookmarkId = null;
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
				Settings.Get(settingName).then((genericItem) => {
					callback(genericItem.value);
				}).catch(() => {
					callback(null);
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
			contextmenus: {
				urlbar: (URLBar) => {
					var URlMenu = new Menu();
					URlMenu.append(new MenuItem({
						label: 'Copy title',
						click() {
							tabs.activePage.getTitle(Pt => clipboard.writeText(Pt));
						}
					}));
					URlMenu.append(new MenuItem({
						label: 'Copy URL',
						click() {
							tabs.activePage.getURL(Purl => clipboard.writeText(Purl));
						}
					}));
					URlMenu.append(new MenuItem({
						label: 'Paste',
						click() {
							URLBar.value = clipboard.readText();
						}
					}));
					return URlMenu;
				},
				quicklink: function (Id, Name, Url, Item) {
					var NewMenu = new Menu();
					NewMenu.append(new MenuItem({
						label: 'Open',
						click() {
							tabs.activePage.navigate(Url);
						}
					}));
					NewMenu.append(new MenuItem({
						label: 'Open in new tab',
						click() {
							tabs.add(Url, undefined, {
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
							Quicklinks.Remove(Id).then(() => {
								Item.parentNode.removeChild(Item);
							});
						}
					}));
					return NewMenu;
				}
			},
			navbar: functions,
			tabbar,
			toggleModel: (content, menuTitle) => {
				let mainWin = document.getElementById('AppBound');
				let bgWin = document.getElementById('BlurBg');
				let modelPopup = document.getElementById('modelPopup');
				let modelTitle =modelPopup.querySelector('.modeltitle');
				let modelContent = document.getElementById('modelContent');
				
				let modelClose = modelPopup.querySelector('.modelClose');
				modelClose.addEventListener('click',() => {
					window.OhHaiBrowser.ui.toggleModel('','');
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
		validate,
		core
	};
};



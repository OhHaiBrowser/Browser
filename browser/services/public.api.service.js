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
				let urlBar = document.getElementById('URLBar');
				urlBar.bookmarkId = ReturnVal;
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
		validate,
		core
	};
};



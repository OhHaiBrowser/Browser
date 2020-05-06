const {clipboard, remote} = require('electron'),
	{Menu,	MenuItem} = remote,
	{tabbar} = require('../../services/tabbar.service'),
	{functions} = require('../../services/navbar.service'),
	{Sessions, History} = require('../../system_assets/modules/OhHaiBrowser.Data'),
	CoreFunctions = require('../../system_assets/modules/OhHaiBrowser.Core'),
	validate = require('../../system_assets/modules/OhHaiBrowser.Validation'),
	{tabItem} = require('./tab/tab.component') ;

customElements.define('tab-item', tabItem);

/**
 * @class WebSession
 */
class WebSession {
	/**
	 * 
	 * @param {Object} opts 
	 */
	constructor(opts) {

		this.sessionEventAdded = false;
		this.id = opts.id;
		this.webReady = false;

		var parseOpenPage = (url) => {
			switch (url) {
			case 'default':
			case undefined:
			case '':
				return 'components/home_page/index.html';
			default:
				return url;
			}
		};

		this.tab = new tabItem({id: opts.id});

		/**
		 * Webview property
		 * @type {Electron.WebviewTag}
		 */
		this.webview = CoreFunctions.generateElement(`<webview id='wv_${opts.id}' src='${parseOpenPage(opts.url)}' class='Hidden'></webview>`);
		if (opts) {
			if (opts.mode) {
				this.mode = String(opts.mode);
			}
			if (opts.title) {
				this.tab.title = String(opts.title);
			}
			if (opts.favicon) {
				this.tab.icon = String(opts.favicon);
			}
		}

		//Tab event listeners
		this.tab.addEventListener('selected', () => {
			window.OhHaiBrowser.tabs.setCurrent(this);
			if (this.webReady) {
				functions.updateURLBar(this.webview);
			}			
		});
		this.tab.addEventListener('titleChange', () => {

		});
		this.tab.addEventListener('modeChange', () => {

		});
		this.tab.addEventListener('mediaClick', (e) => {
			if (e.details == 'playing') {
				this.webview.setAudioMuted(true);
			} else {
				this.webview.setAudioMuted(false);
			}
		});
		this.tab.addEventListener('contextClick', () => {
			var Tab_menu = this.tabContextMenu();
			Tab_menu.popup(remote.getCurrentWindow());
		});
		this.tab.addEventListener('close', () => {
			window.OhHaiBrowser.tabs.remove(this);
		});

		var domLoaded = () => {
			if(this.selected){
				functions.updateURLBar(this.webview);
				window.OhHaiBrowser.bookmarks.check(this.webview.getURL(),function(returnval){
					window.OhHaiBrowser.bookmarks.updateBtn(returnval);
				});
			}
		};
		var updateTab = () => {
			if(this.tab.title != null){
				this.tab.title = this.webview.getTitle();
			}
			if(this.tab.icon == null || this.tab.icon == undefined){
				this.tab.icon = 'assets/imgs/favicon_default.png';
			}
		};
		//View event listeners
		this.webview.addEventListener('page-title-updated', () => {
			updateTab();
		});
		this.webview.addEventListener('close', () => {
			window.OhHaiBrowser.tabs.remove(this);
		});
		this.webview.addEventListener('did-fail-load', (e) => {
			if (e.errorCode != -3 && e.validatedURL == e.target.getURL()) {this.webview.loadURL(`file://${__dirname}/components/error_page/index.html?code=${e.errorCode}&url=${e.validatedURL}`);}
		});
		this.webview.addEventListener('new-window', (e) => {
			switch(e.disposition){
			case 'new-window':
				window.OhHaiBrowser.tabs.popupwindow(e);
				break;
			case 'background-tab':
				window.OhHaiBrowser.tabs.add(e.url);
				break;
			default:
				window.OhHaiBrowser.tabs.add(e.url,undefined,{selected: true});
			}
		});
		this.webview.addEventListener('media-started-playing', () => {
			if(this.webview.isAudioMuted()){
				this.tab.mediaControl = 'mute';
			}else{
				this.tab.mediaControl = 'play';
			}
		});
		this.webview.addEventListener('media-paused', () => {
			if(this.webview.isAudioMuted()){
				this.tab.mediaControl = 'mute';
			}else{
				this.tab.mediaControl = 'play';
			}
		});
		this.webview.addEventListener('page-favicon-updated', (e) => {
			this.tab.icon = e.favicons[0];
		});
		this.webview.addEventListener('focus', () => {
			let openMenuItem = document.querySelector('.contextualMenu:not(.contextualMenuHidden)');
			if(openMenuItem != null){
				document.body.removeChild(openMenuItem);
			}
		});
		this.webview.addEventListener('did-start-loading', () => {
			if(this.tab.mediaControl != 'hide'){
				this.tab.mediaControl = 'hide';
			}
			if(this.selected){
				let urlBar = document.getElementById('URLBar');
				urlBar.updateCertBtn('Loading');
				this.tab.title = 'Loading...';
				this.tab.icon = 'assets/imgs/loader.gif';
			}
			// if(!this.sessionEventAdded){
			// 	var thisWebContent =  remote.webContents.fromId(this.webview.getWebContentsId());
			// 	var thisSession = thisWebContent.session;
			// 	if(thisSession){
			// 		thisSession.webRequest.onBeforeRequest(['*://*./*'], function(details, callback) {
			// 			var test_url = details.url;
				
			// 			var areAdsBlocked = null;
			// 			//OhHaiBrowser.settings.generic('adBlock',(val) => {
			// 			//	areAdsBlocked = val;
			// 			//});
	
			// 			var areTrackersBlocked = null;
			// 			//OhHaiBrowser.settings.generic('trackBlock',(val) => {
			// 			//	areTrackersBlocked = val;
			// 			//});
	
			// 			if(areAdsBlocked == 'true' || areTrackersBlocked == 'true'){
	
			// 				var blockList = '';
			// 				var whiteList = '';
			// 				var releaseRequest = true;
			// 				var blockRequest = true;
	
			// 				if(areAdsBlocked == 'true'){
			// 					blockList += '\.(gr|hk||fm|eu|it|es|is|net|ke|me||tz|za|zm|uk|us|in|com|de|fr|zw|tv|sk|se|php|pk|pl)\/ads?[\-_./\?]|(stats?|rankings?|tracks?|trigg|webtrends?|webtrekk|statistiche|visibl|searchenginejournal|visit|webstat|survey|spring).*.(com|net|de|fr|co|it|se)|cloudflare|\/statistics\/|torrent|[\-_./]ga[\-_./]|[\-_./]counter[\-_./\?]|ad\.admitad\.|\/widgets?[\-_./]?ads?|\/videos?[\-_./]?ads?|\/valueclick|userad|track[\-_./]?ads?|\/top[\-_./]?ads?|\/sponsor[\-_./]?ads?|smartadserver|\/sidebar[\-_]?ads?|popunder|\/includes\/ads?|\/iframe[-_]?ads?|\/header[-_]?ads?|\/framead|\/get[-_]?ads?|\/files\/ad*|exoclick|displayad|\ajax\/ad|adzone|\/assets\/ad*|advertisement|\/adv\/*\.|ad-frame|\.com\/bads\/|follow-us|connect-|-social-|googleplus.|linkedin|footer-social.|social-media|gmail|commission|adserv\.|omniture|netflix|huffingtonpost|dlpageping|log204|geoip\.|baidu|reporting\.|paypal|maxmind|geo\.|api\.bit|hits|predict|cdn-cgi|record_|\.ve$|radar|\.pop|\.tinybar\.|\.ranking|.cash|\.banner\.|adzerk|gweb|alliance|adf\.ly|monitor|urchin_post|imrworldwide|gen204|twitter|naukri|hulu.com|baidu|seotools|roi-|revenue|tracking.js|\/tracking[\-_./]?|elitics|demandmedia|bizrate|click-|click\.|bidsystem|affiliates?\.|beacon|hit\.|googleadservices|metrix|googleanal|dailymotion|ga.js|survey|trekk|visit_|arcadebanners?|visitor\.|ielsen|cts\.|link_|ga-track|FacebookTracking|quantc|traffic|evenuescien|roitra|pixelt|pagetra|metrics|[-_/.]?stats?[.-_/]?|common_|accounts\.|contentad|iqadtile|boxad|audsci.js|ebtrekk|seotrack|clickalyzer|youtube|\/tracker\/|ekomi|clicky|[-_/.]?click?[.-_/]?|[-_/.]?tracking?[.-_/]?|[-_/.]?track?[.-_/]?|ghostery|hscrm|watchvideo|clicks4ads|mkt[0-9]|createsend|analytix|shoppingshadow|clicktracks|admeld|google-analytics|-analytic|googletagservices|googletagmanager|tracking\.|thirdparty|track\.|pflexads|smaato|medialytics|doubleclick|cloudfront|-static|-static-|static-|sponsored-banner|static_|_static_|_static|sponsored_link|sponsored_ad|googleadword|analytics\.|googletakes|adsbygoogle|analytics-|-analytic|analytic-|googlesyndication|google_adsense2|googleAdIndexTop|\/ads\/|google-ad-|google-ad?|google-adsense-|google-adsense.|google-adverts-|google-adwords|google-afc-|google-afc.|google\/ad\?|google\/adv\.|google160.|google728.|_adv|google_afc.|google_afc_|google_afs.|google_afs_widget|google_caf.js|google_lander2.js|google_radlinks_|googlead|googleafc.|googleafs.|googleafvadrenderer.|googlecontextualads.|googleheadad.|googleleader.|googleleads.|googlempu.|ads_|_ads_|_ads|easyads|easyads|easyadstrack|ebayads|[.\-_/\?](ads?|clicks?|tracks?|tracking|logs?)[.\-_/]?(banners?|mid|trends|pathmedia|tech|units?|vert*|fox|area|loc|nxs|format|call|script|final|systems?|show|tag\.?|collect*|slot|right|space|taily|vids?|supply|true|targeting|counts?|nectar|net|onion|parlor|2srv|searcher|fundi|nimation|context|stats?|vertising|class|infuse|includes?|spacers?|code|images?|vers|texts?|work*|tail|track|streams?|ability||world*|zone|position|vertisers?|servers?|view|partner|data)[.\-_/]?';
			// 					whiteList += 'status|premoa.*.jpg|rakuten|nitori-net|search\?tbs\=sbi\:|google.*\/search|ebay.*static.*g|\/shopping\/product|aclk?|translate.googleapis.com|encrypted-|product|www.googleadservices.com\/pagead\/aclk|target.com|.css';
			// 				}
			// 				if(areTrackersBlocked == 'true'){
			// 					blockList += '';
			// 					whiteList += '';
			// 				}
	
			// 				var blockReg = new RegExp('/' + blockList + '/gi');
			// 				var whiteReg = new RegExp('/' + whiteList + '/gi');
			// 				blockRequest = blockReg.test(test_url);
			// 				releaseRequest = whiteReg.test(test_url);
	
			// 				if(releaseRequest){
			// 					callback({cancel: false});
			// 				}else if(blockRequest){
			// 					callback({cancel: true});
			// 				}else{
			// 					callback({cancel: false});
			// 				}
	
			// 			}else{
			// 				callback({cancel: false});
			// 			}
			// 		});
			// 		this.sessionEventAdded = true;
			// 	}
			// }
		});

		this.webview.addEventListener('did-stop-loading', () => {
			domLoaded();
			updateTab();
	
			var CurrentURL = decodeURI(this.webview.getURL());
			if (!validate.internalpage(CurrentURL)){
				//This is not an internal page.
				if(this.mode !== 'incog'){
					var TabIcon = this.tab.icon;
					if(TabIcon == 'assets/imgs/loader.gif'){TabIcon = '';}
	
					History.GetLastItem().then((lastitem) => {
						if(lastitem.url != this.webview.getURL()){
							History.Add(this.webview.getURL(), this.webview.getTitle(), TabIcon, validate.hostname(this.webview.getURL()));
						}		
					}).catch(() => {
						History.Add(this.webview.getURL(), this.webview.getTitle(), TabIcon, validate.hostname(this.webview.getURL()));
					});
				}
			}
		});
		this.webview.addEventListener('dom-ready', () => {
			domLoaded();
			updateTab();
			this.webReady = true;
	
			if(this.mode !== 'incog'){
				Sessions.UpdateWebPage(this.id, this.webview.getURL(), this.webview.getTitle(), this.tab.icon);
			}
	
			var webviewcontent = remote.webContents.fromId(this.webview.getWebContentsId());

			webviewcontent.on('context-menu', (e, params) => {
				e.preventDefault();
				var ViewMenu = this.viewContextualMenu(params);
				ViewMenu.popup(remote.getCurrentWindow());
			});
	
		});

		const nextPage_p = document.getElementById('hov_url');
		this.webview.addEventListener('update-target-url', (e) => {
			//User is focusing or hovering over a link we should show a popup of some sort?
			nextPage_p.textContent = e.url;
			nextPage_p.classList.toggle('show', (e.url !== ''));
		});
	}

	set mode(value) {
		switch (value) {
		case 'incog':
			this.tab.mode = 'incog';
			break;
		case 'dock':
			this.tab.mode = 'pinned';
			Sessions.UpdateMode(this.id, 'DOCK');
			Sessions.UpdateParent(this.id, tabbar.pinnedtabcontainer().id);
			break;
		case 'default':
		default:
			this.tab.mode = 'default';
			Sessions.UpdateMode(this.id, 'Default');
			Sessions.UpdateParent(this.id, tabbar.tabcontainer().id);
		}
	}
	get mode() {
		return this.tab.mode;
	}

	/**
	 * @param {boolean} value
	 */
	set selected(value) {
		if (value) {
			if(this.tab.selected != true){
				this.tab.selected = true;
			}
			this.webview.classList.remove('Hidden');
		} else {
			this.tab.selected = false;
			this.webview.classList.add('Hidden');
		}
	}
	get selected() {
		return this.tab.selected;
	}

	toJson() {
		return JSON.stringify({
			id: this.id,
			url: this.webview.getURL(),
			title: this.tab.title,
			mode: this.mode
		});
	}

	tabContextMenu() {
		var NewMenu = new Menu();
		NewMenu.append(new MenuItem({
			label: 'New Tab',
			click() {
				window.OhHaiBrowser.tabs.add(window.OhHaiBrowser.settings.homepage, undefined, {
					selected: true
				});
			}
		}));
		NewMenu.append(new MenuItem({
			label: 'New Incognito Tab',
			click() {
				window.OhHaiBrowser.tabs.add(window.OhHaiBrowser.settings.homepage, undefined, {
					selected: true,
					mode: 'incog'
				});
			}
		}));
		NewMenu.append(new MenuItem({
			type: 'separator'
		}));
		if (this.tab.parentElement.classList.contains('ohhai-group-children')) {
			//This tabs is in a group
			NewMenu.append(new MenuItem({
				label: 'Remove tab from group',
				click() {
					window.OhHaiBrowser.tabs.groups.removeTab(this.tab);
				}
			}));
		} else {
			//This is a standard tab
			var GroupMenu = [new MenuItem({
				label: 'New group',
				click() {
					window.OhHaiBrowser.tabs.groups.addTab(this.tab, null);
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
							window.OhHaiBrowser.tabs.groups.addTab(this.tab, ThisGroup);
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
		if (this.webview.isAudioMuted() == true) {
			NewMenu.append(new MenuItem({
				label: 'Unmute Tab',
				click() {
					this.webview.setAudioMuted(false);
				}
			}));
		} else {
			NewMenu.append(new MenuItem({
				label: 'Mute Tab',
				click() {
					this.webview.setAudioMuted(true);
				}
			}));
		}
		if(this.mode != 'incog'){
			if(this.mode == 'dock'){
				NewMenu.append(new MenuItem({
					label: 'Undock Tab',
					click() {
						window.OhHaiBrowser.tabs.setMode(this, 'default');
					}
				}));
			}else{
				NewMenu.append(new MenuItem({
					label: 'Dock Tab',
					click() {
						window.OhHaiBrowser.tabs.setMode(this, 'dock');
					}
				}));
			}
		}
		NewMenu.append(new MenuItem({
			type: 'separator'
		}));
		NewMenu.append(new MenuItem({
			label: 'Close Tab',
			click() {
				window.OhHaiBrowser.tabs.remove(this);
			}
		}));

		return NewMenu;
	}

	viewContextualMenu(params){
		const webviewcontent = remote.webContents.fromId(this.webview.getWebContentsId());
		const Web_menu = new Menu();

		if (params.linkURL != '') {
			Web_menu.append(new MenuItem({
				id: '',
				label: 'Open link in new tab',
				click: () => {
					window.OhHaiBrowser.tabs.add(params.linkURL, undefined, { selected: true });
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
					window.OhHaiBrowser.tabs.add(params.srcURL, undefined, {
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
					window.OhHaiBrowser.tabs.add(`https://www.google.co.uk/search?q=${params.selectionText}`, undefined, {
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
				window.OhHaiBrowser.tabs.activePage.goBack();
			}
		}));
		Web_menu.append(new MenuItem({
			label: 'Refresh',
			accelerator: 'CmdOrCtrl+R',
			click() {
				window.OhHaiBrowser.tabs.activePage.reload();
			}
		}));
		Web_menu.append(new MenuItem({
			label: 'Forward',
			accelerator: 'Alt+Right',
			click() {
				window.OhHaiBrowser.tabs.activePage.goForward();
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
	}
    
}
module.exports.WebSession = WebSession;

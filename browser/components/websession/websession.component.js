const {remote} = require('electron'),
	{controls, functions} = require('../../system_assets/components/nav_bar/controls'),
	{Sessions, History} = require('../../system_assets/modules/OhHaiBrowser.Data'),
	CoreFunctions = require('../../system_assets/modules/OhHaiBrowser.Core'),
	validate = require('../../system_assets/modules/OhHaiBrowser.Validation'),
	Doodle = require('../../system_assets/modules/Doodle'),
	tabs = require('../../system_assets/modules/OhHaiBrowser.Tabs.js');

class WebSession {
	constructor(opts) {
		this.id = opts.id;
		this.tab = CoreFunctions.generateElement(`
			<li class='tab' id='t_${opts.id}' data-container='wv_${opts.id}'>
				<a class='tabMediaBtn hidden'></a>
				<img class='ohhai-tab-fav' src='assets/imgs/logo.png'/>
				<span class='ohhai-tab-txt'>New Tab</span>
				<a class='TabClose'></a>
			</li>`);
		this.webview = CoreFunctions.generateElement(`<webview id='wv_${opts.id}' src='${helperFunctions.parseOpenPage(opts.url)}' class='Hidden'></webview>`);
		if (opts) {
			if (opts.mode) {
				this.mode = String(opts.mode);
			}
			if (opts.title) {
				this.title = String(opts.title);
			}
			if (opts.favicon) {
				this.icon = String(opts.favicon);
			}
		}
		helperFunctions.addEventListeners(this);
	}

	set mode(value) {
		switch (value) {
		case 'incog':
			this.tab.classList.add('IncognitoTab');
			break;
		case 'dock':
			this.tab.classList.remove('DefaultTab');
			this.tab.classList.add('DockTab');
			break;
		case 'default':
		default:
			this.tab.classList.remove('DockTab');
			this.tab.classList.add('DefaultTab');
		}
	}
	get mode() {
		return this.tab.classList.contains('IncognitoTab') ? 'incog' : this.tab.classList.contains('DockTab') ? 'dock' : 'default';
	}

	/**
	 * @param {boolean} value
	 */
	set selected(value) {
		if (value) {
			this.tab.classList.add('current');
			this.webview.classList.remove('Hidden');
		} else {
			this.tab.classList.remove('current');
			this.webview.classList.add('Hidden');
		}
	}
	get selected() {
		return this.tab.classList.contains('current');
	}
    
	/**
	 * @param {string} value
	 */
	set title(value) {
		var tabTxt = this.tab.querySelector('.ohhai-tab-txt');
		tabTxt.textContent = value;
	}
	get title() {
		return this.tab.querySelector('.ohhai-tab-txt').textContent;
	}
    
	set icon(value) {
		var tabFav = this.tab.querySelector('.ohhai-tab-fav');
		tabFav.src = value;
	}
	get icon() {
		return this.tab.querySelector('.ohhai-tab-fav').src;
	}
    
	set mediaControl(value) {
		var tabMediaBtn = this.tab.querySelector('.tabMediaBtn');
		tabMediaBtn.classList.remove('hidden', 'tabMute', 'tabPlaying');
		switch (value) {
		case 'play': 
			tabMediaBtn.classList.add('hidden');
			break;
		case 'mute':
			tabMediaBtn.classList.add('tabMute');
			break;
		case 'hide' :
		default :
			tabMediaBtn.classList.add('tabPlaying');
			break;
		}
	}
	get mediaControl() {
		var tabMediaBtn = this.tab.querySelector('.tabMediaBtn');
		return tabMediaBtn.classList.contains('hidden') ? 'hide' : tabMediaBtn.classList.contains('tabMute') ? 'mute' : 'play';
	}

	toJson() {
		return JSON.stringify({
			id: this.id,
			url: this.webview.getURL(),
			title: this.title,
			mode: this.mode
		});
	}
    
};
module.exports.WebSession = WebSession;

const helperFunctions = {
	/**
	 * @param {string} url
	 */
	parseOpenPage: (url) => {
		switch (url) {
		case 'default':
		case undefined:
		case '':
			return 'components/home_page/index.html';
		default:
			return url;
		}
	},
	/**
	 * @param {WebSession} ws
	 */
	domloaded: (ws) => {
		if(ws.selected){
			functions.updateURLBar(ws.webview);
			controls.lnk_cirtpip.classList.remove('Loading');
			//check if this site is a qlink
			OhHaiBrowser.bookmarks.check(ws.webview.getURL(),function(returnval){
				OhHaiBrowser.bookmarks.updateBtn(returnval);
			});
		}
	},
	/**
	 * @param {WebSession} ws
	 */
	updateTab: (ws) => {
		if(ws.title != null){
			ws.title = ws.webview.getTitle(); 
		}
		if(ws.icon != null){
			ws.icon = 'assets/imgs/favicon_default.png';
		}
	},
	/**
	 * @param {WebSession} ws
	 */
	addEventListeners: (ws) => {
		let sessionEventAdded = false;

		ws.webview.addEventListener('did-start-loading', () => {
			if(ws.mediaControl != 'hide'){
				ws.mediaControl = 'hide';
			}
			if(ws.selected){
				controls.lnk_cirtpip.classList.add('Loading');
				ws.title = 'Loading...';
				ws.icon = 'assets/imgs/loader.gif';
			}
			if(!sessionEventAdded){
				var thisWebContent =  ws.webview.getWebContents();
				var thisSession = thisWebContent.session;
				if(thisSession){
					thisSession.webRequest.onBeforeRequest(['*://*./*'], function(details, callback) {
						var test_url = details.url;
				
						var areAdsBlocked = null;
						//OhHaiBrowser.settings.generic('adBlock',(val) => {
						//	areAdsBlocked = val;
						//});
	
						var areTrackersBlocked = null;
						//OhHaiBrowser.settings.generic('trackBlock',(val) => {
						//	areTrackersBlocked = val;
						//});
	
						if(areAdsBlocked == 'true' || areTrackersBlocked == 'true'){
	
							var blockList = '';
							var whiteList = '';
							var releaseRequest = true;
							var blockRequest = true;
	
							if(areAdsBlocked == 'true'){
								blockList += '\.(gr|hk||fm|eu|it|es|is|net|ke|me||tz|za|zm|uk|us|in|com|de|fr|zw|tv|sk|se|php|pk|pl)\/ads?[\-_./\?]|(stats?|rankings?|tracks?|trigg|webtrends?|webtrekk|statistiche|visibl|searchenginejournal|visit|webstat|survey|spring).*.(com|net|de|fr|co|it|se)|cloudflare|\/statistics\/|torrent|[\-_./]ga[\-_./]|[\-_./]counter[\-_./\?]|ad\.admitad\.|\/widgets?[\-_./]?ads?|\/videos?[\-_./]?ads?|\/valueclick|userad|track[\-_./]?ads?|\/top[\-_./]?ads?|\/sponsor[\-_./]?ads?|smartadserver|\/sidebar[\-_]?ads?|popunder|\/includes\/ads?|\/iframe[-_]?ads?|\/header[-_]?ads?|\/framead|\/get[-_]?ads?|\/files\/ad*|exoclick|displayad|\ajax\/ad|adzone|\/assets\/ad*|advertisement|\/adv\/*\.|ad-frame|\.com\/bads\/|follow-us|connect-|-social-|googleplus.|linkedin|footer-social.|social-media|gmail|commission|adserv\.|omniture|netflix|huffingtonpost|dlpageping|log204|geoip\.|baidu|reporting\.|paypal|maxmind|geo\.|api\.bit|hits|predict|cdn-cgi|record_|\.ve$|radar|\.pop|\.tinybar\.|\.ranking|.cash|\.banner\.|adzerk|gweb|alliance|adf\.ly|monitor|urchin_post|imrworldwide|gen204|twitter|naukri|hulu.com|baidu|seotools|roi-|revenue|tracking.js|\/tracking[\-_./]?|elitics|demandmedia|bizrate|click-|click\.|bidsystem|affiliates?\.|beacon|hit\.|googleadservices|metrix|googleanal|dailymotion|ga.js|survey|trekk|visit_|arcadebanners?|visitor\.|ielsen|cts\.|link_|ga-track|FacebookTracking|quantc|traffic|evenuescien|roitra|pixelt|pagetra|metrics|[-_/.]?stats?[.-_/]?|common_|accounts\.|contentad|iqadtile|boxad|audsci.js|ebtrekk|seotrack|clickalyzer|youtube|\/tracker\/|ekomi|clicky|[-_/.]?click?[.-_/]?|[-_/.]?tracking?[.-_/]?|[-_/.]?track?[.-_/]?|ghostery|hscrm|watchvideo|clicks4ads|mkt[0-9]|createsend|analytix|shoppingshadow|clicktracks|admeld|google-analytics|-analytic|googletagservices|googletagmanager|tracking\.|thirdparty|track\.|pflexads|smaato|medialytics|doubleclick|cloudfront|-static|-static-|static-|sponsored-banner|static_|_static_|_static|sponsored_link|sponsored_ad|googleadword|analytics\.|googletakes|adsbygoogle|analytics-|-analytic|analytic-|googlesyndication|google_adsense2|googleAdIndexTop|\/ads\/|google-ad-|google-ad?|google-adsense-|google-adsense.|google-adverts-|google-adwords|google-afc-|google-afc.|google\/ad\?|google\/adv\.|google160.|google728.|_adv|google_afc.|google_afc_|google_afs.|google_afs_widget|google_caf.js|google_lander2.js|google_radlinks_|googlead|googleafc.|googleafs.|googleafvadrenderer.|googlecontextualads.|googleheadad.|googleleader.|googleleads.|googlempu.|ads_|_ads_|_ads|easyads|easyads|easyadstrack|ebayads|[.\-_/\?](ads?|clicks?|tracks?|tracking|logs?)[.\-_/]?(banners?|mid|trends|pathmedia|tech|units?|vert*|fox|area|loc|nxs|format|call|script|final|systems?|show|tag\.?|collect*|slot|right|space|taily|vids?|supply|true|targeting|counts?|nectar|net|onion|parlor|2srv|searcher|fundi|nimation|context|stats?|vertising|class|infuse|includes?|spacers?|code|images?|vers|texts?|work*|tail|track|streams?|ability||world*|zone|position|vertisers?|servers?|view|partner|data)[.\-_/]?';
								whiteList += 'status|premoa.*.jpg|rakuten|nitori-net|search\?tbs\=sbi\:|google.*\/search|ebay.*static.*g|\/shopping\/product|aclk?|translate.googleapis.com|encrypted-|product|www.googleadservices.com\/pagead\/aclk|target.com|.css';
							}
							if(areTrackersBlocked == 'true'){
								blockList += '';
								whiteList += '';
							}
	
							var blockReg = new RegExp('/' + blockList + '/gi');
							var whiteReg = new RegExp('/' + whiteList + '/gi');
							blockRequest = blockReg.test(test_url);
							releaseRequest = whiteReg.test(test_url);
	
							if(releaseRequest){
								callback({cancel: false});
							}else if(blockRequest){
								callback({cancel: true});
							}else{
								callback({cancel: false});
							}
	
						}else{
							callback({cancel: false});
						}
					});
					sessionEventAdded = true;
				}
			}
		});
	
		ws.webview.addEventListener('did-stop-loading', () => {
			helperFunctions.domloaded(ws);
			helperFunctions.updateTab(ws);
	
			var CurrentURL = decodeURI(ws.webview.getURL());
			if (!validate.internalpage(CurrentURL)){
				//This is not an internal page.
				if(ws.mode !== 'incog'){
					var TabIcon = ws.icon;
					if(TabIcon == 'assets/imgs/loader.gif'){TabIcon = '';}
	
					History.GetLastItem((lastitem) => {
						if(lastitem == undefined){
							History.Add(ws.webview.getURL(), ws.webview.getTitle(), TabIcon, validate.hostname(ws.webview.getURL()));
						}else{
							if(lastitem.url != ws.webview.getURL()){
								History.Add(ws.webview.getURL(), ws.webview.getTitle(), TabIcon, validate.hostname(ws.webview.getURL()));
							}
						}		
					});
				}
			}
		});
	
		ws.webview.addEventListener('load-commit', (e) => {
			if(ws.selected){
				//only kick event if the mainframe is loaded, no comments or async BS!
				if(e.isMainFrame){
					//is doodle already open? - we dont want to bug the users so much. - Actully we shouldnt need to check...Doodle should know.
					Doodle.DEPLOY(ws.webview);
				}
			}
		});
	
		ws.webview.addEventListener('page-title-updated', () => {
			helperFunctions.updateTab(ws);
		});
	
		ws.webview.addEventListener('dom-ready', () => {
			helperFunctions.domloaded(ws);
			helperFunctions.updateTab(ws);
	
			if(ws.mode !== 'incog'){
				Sessions.UpdateWebPage(ws.id, ws.webview.getURL(), ws.webview.getTitle(), ws.icon , function(id){});
			}
	
			var webviewcontent = ws.webview.getWebContents();	
			webviewcontent.on('context-menu', (e, params) => {
				e.preventDefault();
				var ViewMenu = helperFunctions.viewContextualMenu(ws);
				var WbMen = OhHaiBrowser.ui.contextmenus.webview(ws.webview, webviewcontent, params);
				WbMen.popup(remote.getCurrentWindow());
			});
	
		});
	
		ws.webview.addEventListener('did-fail-load', (e) => {
			if (e.errorCode != -3 && e.validatedURL == e.target.getURL()) {ws.webview.loadURL(OhHaiBrowser.builtInPages.errorPage + '?code=' + e.errorCode + '&url=' + e.validatedURL);}
		});
	
		ws.webview.addEventListener('close', () => {
			tabs.remove(ws);
		});
	
		ws.webview.addEventListener('new-window', (e) => {
			switch(e.disposition){
			case 'new-window':
				tabs.popupwindow(e, (window) => {
	
				});
				break;
			case 'background-tab':
				tabs.add(e.url,undefined);
				break;
			default:
				tabs.add(e.url,undefined,{selected: true});
			}
		});
	
		ws.webview.addEventListener('media-started-playing', (e) => {
			if(ws.webview.isAudioMuted()){
				ws.mediaControl = 'mute';
			}else{
				ws.mediaControl = 'play';
			}
		});
	
		ws.webview.addEventListener('media-paused', (e) => {
			if(ws.webview.isAudioMuted()){
				ws.mediaControl = 'mute';
			}else{
				ws.mediaControl = 'play';
			}
		});
	
		ws.webview.addEventListener('page-favicon-updated', (e) => {
			ws.icon = e.favicons[0];
		});
		ws.webview.addEventListener('focus', () => {
			let openMenuItem = document.querySelector('.contextualMenu:not(.contextualMenuHidden)');
			if(openMenuItem != null){
				document.body.removeChild(openMenuItem);
			}
		});
	
		//Tab Listeners
		ws.tab.addEventListener('click', (e) => {
			switch(e.target.className){
			case 'TabClose':
				tabs.remove(ws);
				break;
			case 'tabPlaying':
				ws.webview.setAudioMuted(true);
				break;
			case 'tabMute':
				ws.webview.setAudioMuted(false);
				break;
			default:
				tabs.setCurrent(ws);
				functions.updateURLBar(ws.webview);
			}
		});
	
		ws.tab.addEventListener('contextmenu', (e) => {
			e.preventDefault();
			var Tab_menu = helperFunctions.tabContextualMenu(ws);
			var TbMen = OhHaiBrowser.ui.contextmenus.tab(ws);
			TbMen.popup(remote.getCurrentWindow());
		}, false);
	},
	/**
	 * @param {WebSession} ws
	 */
	tabContextualMenu: (ws) => {

	},
	/**
	 * @param {WebSession} ws
	 */
	viewContextualMenu: (ws) => {

	}
}

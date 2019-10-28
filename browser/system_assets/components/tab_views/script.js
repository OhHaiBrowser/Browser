let {remote} = require('electron'),
	{controls, functions} = require('./../nav_bar/controls'),
	{Sessions, History} = require('./../../modules/OhHaiBrowser.Data');

module.exports = (webSession) => {
	
	let validate = require('./../../modules/OhHaiBrowser.Validation'),
		Doodle = require('./../../modules/Doodle'),
		sessionEventAdded = false;

	webSession.webview.addEventListener('did-start-loading', () => {
		if(webSession.mediaControl != 'hide'){
			webSession.mediaControl = 'hide';
		}
		if(webSession.selected){
			loadstart(webSession);
		}
		if(!sessionEventAdded){
			var thisWebContent =  webSession.webview.getWebContents();
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

	webSession.webview.addEventListener('did-stop-loading', () => {
		domloaded(webSession);
		UpdateTab(webSession);

		var CurrentURL = decodeURI(webSession.webview.getURL());
		if (!validate.internalpage(CurrentURL)){
		//This is not an internal page.
			if(!webSession.tab.classList.contains('IncognitoTab')){
				var TabIcon = websession.icon;
				if(TabIcon == 'assets/imgs/loader.gif'){TabIcon = '';}

				History.GetLastItem((lastitem) => {
					if(lastitem == undefined){
						History.Add(webSession.tab.getURL(), webSession.webview.getTitle(), TabIcon, OhHaiBrowser.validate.hostname(webSession.webview.getURL()));
					}else{
						if(lastitem.url != webSession.webview.getURL()){
							History.Add(webSession.webview.getURL(), webSession.webview.getTitle(), TabIcon, OhHaiBrowser.validate.hostname(webSession.webview.getURL()));
						}
					}		
				});
			}
		}
	});

	webSession.webview.addEventListener('load-commit', (e) => {
		if(webSession.selected){
			//only kick event if the mainframe is loaded, no comments or async BS!
			if(e.isMainFrame){
				//is doodle already open? - we dont want to bug the users so much. - Actully we shouldnt need to check...Doodle should know.
				Doodle.DEPLOY(webSession.webview);
			}
		}
	});

	webSession.webview.addEventListener('page-title-updated', () => {
		UpdateTab(webSession);
	});

	webSession.webview.addEventListener('dom-ready', () => {
		domloaded(webSession);
		UpdateTab(webSession);

		if(!webSession.tab.classList.contains('IncognitoTab')){
			Sessions.UpdateWebPage(webSession.id, webSession.webview.getURL(), webSession.webview.getTitle(), websession.icon , function(id){});
		}

		var webviewcontent = webSession.webview.getWebContents();	
		webviewcontent.on('context-menu', (e, params) => {
			e.preventDefault();
			var WbMen = OhHaiBrowser.ui.contextmenus.webview(webSession.webview, webviewcontent, params);
			WbMen.popup(remote.getCurrentWindow());
		});

	});

	webSession.webview.addEventListener('did-fail-load', (e) => {
		if (e.errorCode != -3 && e.validatedURL == e.target.getURL()) {webSession.webview.loadURL(OhHaiBrowser.builtInPages.errorPage + '?code=' + e.errorCode + '&url=' + e.validatedURL);}
	});

	webSession.webview.addEventListener('close', () => {
		OhHaiBrowser.tabs.remove(webSession);
	});

	webSession.webview.addEventListener('new-window', (e) => {
		switch(e.disposition){
		case 'new-window':
			OhHaiBrowser.tabs.popupwindow(e, (window) => {

			});
			break;
		case 'background-tab':
			OhHaiBrowser.tabs.add(e.url,undefined);
			break;
		default:
			OhHaiBrowser.tabs.add(e.url,undefined,{selected: true});
		}
	});

	webSession.webview.addEventListener('media-started-playing', (e) => {
		if(webSession.webview.isAudioMuted()){
			webSession.mediaControl = 'mute';
		}else{
			webSession.mediaControl = 'play';
		}
	});

	webSession.webview.addEventListener('media-paused', (e) => {
		if(webSession.webview.isAudioMuted()){
			webSession.mediaControl = 'mute';
		}else{
			webSession.mediaControl = 'play';
		}
	});

	webSession.webview.addEventListener('page-favicon-updated', (e) => {
		websession.icon = e.favicons[0];
	});
	webSession.webview.addEventListener('focus', () => {
		let openMenuItem = document.querySelector('.contextualMenu:not(.contextualMenuHidden)');
		if(openMenuItem != null){
			document.body.removeChild(openMenuItem);
		}
	});

	//Tab Listeners
	webSession.tab.addEventListener('click', (e) => {
		switch(e.target.className){
		case 'TabClose':
			OhHaiBrowser.tabs.remove(webSession);
			break;
		case 'tabPlaying':
			webSession.webview.setAudioMuted(true);
			break;
		case 'tabMute':
			webSession.webview.setAudioMuted(false);
			break;
		default:
			OhHaiBrowser.tabs.setCurrent(webSession);
			functions.updateURLBar(webSession.webview);
		}
	});

	webSession.tab.addEventListener('contextmenu', (e) => {
		e.preventDefault();
		var TbMen = OhHaiBrowser.ui.contextmenus.tab(webSession);
		TbMen.popup(remote.getCurrentWindow());
	}, false);
};


function loadstart(websession){
	controls.lnk_cirtpip.classList.add('Loading');
	websession.title = 'Loading...';
	websession.icon = 'assets/imgs/loader.gif';
}

function domloaded(thisSession){
	if(thisSession.selected){
		functions.updateURLBar(thisSession.webview);
		controls.lnk_cirtpip.classList.remove('Loading');
		//check if this site is a qlink
		OhHaiBrowser.bookmarks.check(thisSession.webview.getURL(),function(returnval){
			OhHaiBrowser.bookmarks.updateBtn(returnval);
		});
	}
}

function UpdateTab(websession){
	if(websession.title != null){
		websession.title = websession.webview.getTitle(); 
	}
	if(websession.icon != null){
		SetFavIcon(websession);	
	}
}

function SetFavIcon(websession) {
	websession.icon = 'assets/imgs/favicon_default.png';
}

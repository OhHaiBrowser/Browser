//Functions for tab reordering
new Slip(OhHaiBrowser.ui.tabbar.tabcontainer);

OhHaiBrowser.ui.tabbar.tabcontainer.addEventListener('slip:beforeswipe', function(e){
	e.preventDefault();
}, false);

OhHaiBrowser.ui.tabbar.tabcontainer.addEventListener('slip:reorder', function(e){
    e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
    return false;
}, false);




//Functions for webview events
//-------------------------------------------------------------------
function AddListeners(webview,fulltab,tabimg,tabtext,ControlsId){

	var sessionEventAdded = false;
	var tabMediaBtn = fulltab.querySelector(".tabMediaBtn");

	webview.addEventListener("did-start-loading", function() {
		if(!tabMediaBtn.classList.contains("hidden")){
			tabMediaBtn.classList.add("hidden");
		}
		
		if(OhHaiBrowser.tabs.isCurrent(fulltab)){
			loadstart(tabtext,tabimg,webview);
		}
		if(!sessionEventAdded){
			var thisWebContent =  webview.getWebContents();
			var thisSession = thisWebContent.session;
			if(thisSession){
				thisSession.webRequest.onBeforeRequest(['*://*./*'], function(details, callback) {
					var test_url = details.url;
					
					var areAdsBlocked = null;
					OhHaiBrowser.settings.generic("adBlock",(val) => {
						areAdsBlocked = val;
					});

					var areTrackersBlocked = null;
					OhHaiBrowser.settings.generic("trackBlock",(val) => {
						areTrackersBlocked = val;
					});

					if(areAdsBlocked == "true" || areTrackersBlocked == "true"){

						var blockList = "";
						var whiteList = "";
						var releaseRequest = true;
						var blockRequest = true;

						if(areAdsBlocked == "true"){
							blockList += "\.(gr|hk||fm|eu|it|es|is|net|ke|me||tz|za|zm|uk|us|in|com|de|fr|zw|tv|sk|se|php|pk|pl)\/ads?[\-_./\?]|(stats?|rankings?|tracks?|trigg|webtrends?|webtrekk|statistiche|visibl|searchenginejournal|visit|webstat|survey|spring).*.(com|net|de|fr|co|it|se)|cloudflare|\/statistics\/|torrent|[\-_./]ga[\-_./]|[\-_./]counter[\-_./\?]|ad\.admitad\.|\/widgets?[\-_./]?ads?|\/videos?[\-_./]?ads?|\/valueclick|userad|track[\-_./]?ads?|\/top[\-_./]?ads?|\/sponsor[\-_./]?ads?|smartadserver|\/sidebar[\-_]?ads?|popunder|\/includes\/ads?|\/iframe[-_]?ads?|\/header[-_]?ads?|\/framead|\/get[-_]?ads?|\/files\/ad*|exoclick|displayad|\ajax\/ad|adzone|\/assets\/ad*|advertisement|\/adv\/*\.|ad-frame|\.com\/bads\/|follow-us|connect-|-social-|googleplus.|linkedin|footer-social.|social-media|gmail|commission|adserv\.|omniture|netflix|huffingtonpost|dlpageping|log204|geoip\.|baidu|reporting\.|paypal|maxmind|geo\.|api\.bit|hits|predict|cdn-cgi|record_|\.ve$|radar|\.pop|\.tinybar\.|\.ranking|.cash|\.banner\.|adzerk|gweb|alliance|adf\.ly|monitor|urchin_post|imrworldwide|gen204|twitter|naukri|hulu.com|baidu|seotools|roi-|revenue|tracking.js|\/tracking[\-_./]?|elitics|demandmedia|bizrate|click-|click\.|bidsystem|affiliates?\.|beacon|hit\.|googleadservices|metrix|googleanal|dailymotion|ga.js|survey|trekk|visit_|arcadebanners?|visitor\.|ielsen|cts\.|link_|ga-track|FacebookTracking|quantc|traffic|evenuescien|roitra|pixelt|pagetra|metrics|[-_/.]?stats?[.-_/]?|common_|accounts\.|contentad|iqadtile|boxad|audsci.js|ebtrekk|seotrack|clickalyzer|youtube|\/tracker\/|ekomi|clicky|[-_/.]?click?[.-_/]?|[-_/.]?tracking?[.-_/]?|[-_/.]?track?[.-_/]?|ghostery|hscrm|watchvideo|clicks4ads|mkt[0-9]|createsend|analytix|shoppingshadow|clicktracks|admeld|google-analytics|-analytic|googletagservices|googletagmanager|tracking\.|thirdparty|track\.|pflexads|smaato|medialytics|doubleclick|cloudfront|-static|-static-|static-|sponsored-banner|static_|_static_|_static|sponsored_link|sponsored_ad|googleadword|analytics\.|googletakes|adsbygoogle|analytics-|-analytic|analytic-|googlesyndication|google_adsense2|googleAdIndexTop|\/ads\/|google-ad-|google-ad?|google-adsense-|google-adsense.|google-adverts-|google-adwords|google-afc-|google-afc.|google\/ad\?|google\/adv\.|google160.|google728.|_adv|google_afc.|google_afc_|google_afs.|google_afs_widget|google_caf.js|google_lander2.js|google_radlinks_|googlead|googleafc.|googleafs.|googleafvadrenderer.|googlecontextualads.|googleheadad.|googleleader.|googleleads.|googlempu.|ads_|_ads_|_ads|easyads|easyads|easyadstrack|ebayads|[.\-_/\?](ads?|clicks?|tracks?|tracking|logs?)[.\-_/]?(banners?|mid|trends|pathmedia|tech|units?|vert*|fox|area|loc|nxs|format|call|script|final|systems?|show|tag\.?|collect*|slot|right|space|taily|vids?|supply|true|targeting|counts?|nectar|net|onion|parlor|2srv|searcher|fundi|nimation|context|stats?|vertising|class|infuse|includes?|spacers?|code|images?|vers|texts?|work*|tail|track|streams?|ability||world*|zone|position|vertisers?|servers?|view|partner|data)[.\-_/]?";
							whiteList += "status|premoa.*.jpg|rakuten|nitori-net|search\?tbs\=sbi\:|google.*\/search|ebay.*static.*g|\/shopping\/product|aclk?|translate.googleapis.com|encrypted-|product|www.googleadservices.com\/pagead\/aclk|target.com|.css";
						}
						if(areTrackersBlocked == "true"){
							blockList += "";
							whiteList += "";
						}

						var blockReg = new RegExp("/" + blockList + "/gi");
						var whiteReg = new RegExp("/" + whiteList + "/gi");
						blockRequest = blockReg.test(test_url);
						releaseRequest = whiteReg.test(test_url);

						if(releaseRequest){
							callback({cancel: false})
						}else if(blockRequest){
							callback({cancel: true});
						}else{
							callback({cancel: false})
						}

					}else{
						callback({cancel: false});
					}
				});
				sessionEventAdded = true;
			}
		}
	});

	webview.addEventListener("did-stop-loading", function() {
		domloaded(fulltab,webview);
		UpdateTab(tabtext,null,webview);

		var CurrentURL = decodeURI(webview.getURL());
		if (!OhHaiBrowser.validate.internalpage(CurrentURL)){
			//This is not an internal page.
      		if(!fulltab.classList.contains("IncognitoTab")){
				var TabIcon = tabimg.src;
				if(TabIcon == 'system_assets/icons/loader.gif'){TabIcon = "";}

        		var LastURL = History.GetLastItem(function(lastitem){
          			if(lastitem == undefined){
            			History.Add(webview.getURL(),webview.getTitle(),TabIcon,OhHaiBrowser.validate.hostname(webview.getURL()));
          			}else{
            			if(lastitem.url != webview.getURL()){
              				History.Add(webview.getURL(),webview.getTitle(),TabIcon,OhHaiBrowser.validate.hostname(webview.getURL()));
            			}
          			}		
        		});
      		}
		}
	});

	webview.addEventListener("load-commit", function(e) {
		if(OhHaiBrowser.tabs.isCurrent(fulltab)){
			//only kick event if the mainframe is loaded, no comments or async BS!
			if(e.isMainFrame){
				//is doodle already open? - we dont want to bug the users so much. - Actully we shouldnt need to check...Doodle should know.
				Doodle.DEPLOY(webview);
			}
		}
	});


	webview.addEventListener("page-title-updated", function() {
		UpdateTab(tabtext,null,webview);
	});
	webview.addEventListener("dom-ready", function() {
		domloaded(fulltab,webview);
		UpdateTab(tabtext,tabimg,webview);

		if(!fulltab.classList.contains("IncognitoTab")){Sessions.UpdateWebPage(ControlsId,webview.getURL(),webview.getTitle(),function(id){});}

		var webviewcontent = webview.getWebContents();	
		webviewcontent.on("context-menu", (e, params) => {
			e.preventDefault()
			var WbMen = OhHaiBrowser.ui.contextmenus.webview(webview,webviewcontent,params);
			WbMen.popup(remote.getCurrentWindow())
		});
	
	});
	webview.addEventListener("did-fail-load", function (e) {
		if (e.errorCode != -3 && e.validatedURL == e.target.getURL()) {webview.loadURL(OhHaiBrowser.builtInPages.errorPage);}
	});
	webview.addEventListener("close", function() {
		OhHaiBrowser.tabs.remove(fulltab);
	});

	webview.addEventListener("new-window", function(e) {
		switch(e.disposition){
			case "new-window":
				OhHaiBrowser.tabs.popupwindow(e,function(window){
					
				});
				break;
			case "background-tab":
				OhHaiBrowser.tabs.add(e.url,undefined);
			break;
			default:
				OhHaiBrowser.tabs.add(e.url,undefined,{selected: true});
		}
	});
	
	

  	webview.addEventListener("media-started-playing", function (e) {
		if(webview.isAudioMuted()){
			tabMediaBtn.classList.add("tabMute");
			tabMediaBtn.classList.remove("hidden");
		}else{
			tabMediaBtn.classList.add("tabPlaying");
			tabMediaBtn.classList.remove("hidden");
		}
	});
	webview.addEventListener("media-paused", function (e) {
		if(webview.isAudioMuted()){
			tabMediaBtn.classList.add("tabMute");
			tabMediaBtn.classList.remove("hidden");
		}else{
			tabMediaBtn.classList.add("tabPlaying");
			tabMediaBtn.classList.remove("hidden");
		}
	});



	webview.addEventListener("page-favicon-updated",function(e){
		tabimg.src= e.favicons[0];
	});
  	webview.addEventListener('focus',function(e){
		OhHaiBrowser.ui.overflowmenu.setvis(false);
	});

	//Tab Listeners
	fulltab.addEventListener("click", function(e) {
    	switch(e.target.className){
     		case "TabClose":
				 OhHaiBrowser.tabs.remove(fulltab);
				break;
			case "tabPlaying":
				webview.setAudioMuted(true);
				break;
			case "tabMute":
				webview.setAudioMuted(false);
				break;
			  default:
				  OhHaiBrowser.tabs.setCurrent(fulltab,webview);
				  OhHaiBrowser.ui.navbar.updateURLBar(webview);
    	}
	});

	fulltab.addEventListener('contextmenu', (e) => {
		e.preventDefault()
		var TbMen = OhHaiBrowser.ui.contextmenus.tab(fulltab,webview,tabtext,fulltab.querySelector('.TabClose'));
		TbMen.popup(remote.getCurrentWindow())
	}, false);
}

function loadstart(tabtext,tabimg,webview){
	$('#SecureCheck').addClass("Loading");
  	$(tabtext).text("Loading...");
	tabimg.src= "system_assets/icons/loader.gif";
}

function domloaded(fulltab,webview){
	if(OhHaiBrowser.tabs.isCurrent(fulltab)){
		//tabs.updateURLBar(webview);
		OhHaiBrowser.ui.navbar.updateURLBar(webview);
		$('#SecureCheck').removeClass("Loading");
		//check if this site is a qlink
		OhHaiBrowser.bookmarks.check(webview.getURL(),function(returnval){
			OhHaiBrowser.bookmarks.updateBtn(returnval);
		});
	}
}

function UpdateTab(tabtext,tabimg,webview){
	if(tabtext != null){
		$(tabtext).text(webview.getTitle());
	}
	if(tabimg != null){
		SetFavIcon(tabimg,webview);	
	}
}

function FindFavIcon(Webview){
	Webview.executeJavaScript("links = document.getElementsByTagName('link');",function(e){ var CodeBreak = e[0]; });
}
function SetFavIcon(control,webview) {

	var Content = webview.webContents;

	webview.executeJavaScript("window.location.host",
	function(e){
		var TestFavUri = "http://"+ e +"/favicon.ico";
			//Look somewhere else
			FindFavIcon(webview);
			control.src = 'file:///' + __dirname + '/system_assets/icons/favicon_default.png';//FindFavIcon(webview);
	});
}

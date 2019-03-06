let CoreFunctions = require(`./system_assets/modules/OhHaiBrowser.Core.js`);
var {History, Sessions} = require('./system_assets/modules/OhHaiBrowser.Data.js');

class TabView {
    id = '';
    mode = 'default';
    selected = false;
    title = 'New Tab';
    url = '';
    favIcon = 'system_assets/icons/favicon_default.png';
    constructor(options){
		this.id = options.id;
		this.url = options.url;
		this.title = options.title;
		this.favIcon = options.favicon;
        this.tab = CoreFunctions.generateElement(`
        <li id='t_${options.id}' data-container='wv_${options.id}' class='tab' title=''>
	        <a class='tabMediaBtn hidden'></a>
		    <img class='ohhai-tab-fav' src='${this.favIcon}'/>
		    <span class='ohhai-tab-txt'>${this.title}</span>
		    <a class='TabClose'></a>
        <li>`);
        this.view = CoreFunctions.generateElement(`<webview id='wv_${options.id}' src='' class='hidden'></webview>`);

		options.mode == 'incog' ? this.tab.classList.add("IncognitoTab") : null;

        addEvents(this);
    }
    remove(){
        
    }
    get tab(){
        return this.tab;
    }
    get view(){
        return this.view;
    }

    get mode(){
        return this.mode;
    }
    set mode(_mode){
		switch(_mode){
			case 'incog':
				this.tab.classList.add("IncognitoTab");
				this.mode = 'incog';
			break;
			case 'default':
			default:
				this.tab.classList.remove("IncognitoTab");
				this.mode = 'default';
		}
    }

    get selected(){
        return this.selected;
    }
    set selected(_selected){
        if(_selected){
            this.tab.classList.remove('hidden');
            this.view.classList.remove('hidden');
            this.selected = true;
        }else{
            this.tab.classList.add('hidden');
            this.view.classList.add('hidden');
            this.selected = false;
        }
    }

    get title(){
        return this.title;
    }
    set title(_title){
        let tabElText = this.tab.querySelector('.ohhai-tab-txt');
        tabElText.textContent = _title;
        this.title = _title;
    }

    get url(){
        return this.url;
    }
    set url(_url){
        //this.view.navigate(_url);
        this.url = _url;
    }

    get favIcon(){
        return this.favIcon;
    }
    set favIcon(_favicon){
        let FaviconEl = this.tab.querySelector('.ohhai-tab-fav');
        FaviconEl.src = _favicon;
        this.favIcon = __filename;
    }
}

function addEvents(_Tabview){
    let sessionEventAdded = false,
    tab_MediaBtn = _Tabview.tab.querySelector(".tabMediaBtn");

    // Webview Events
    _Tabview.view.addEventListener("did-start-loading", function() {
        if(!tab_MediaBtn.classList.contains("hidden")){
			tab_MediaBtn.classList.add("hidden");
        }
        if(_Tabview.selected){
            $('#SecureCheck').addClass("Loading");
            _Tabview.title = `Loaded...`;
            _Tabview.favIcon = "system_assets/icons/loader.gif";
        }
        if(!sessionEventAdded){
			var thisWebContent =  _Tabview.view.getWebContents();
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
    _Tabview.view.addEventListener("did-stop-loading", function() {
        domloaded(_Tabview);
		UpdateTab(_Tabview);

		_Tabview.url = decodeURI(_Tabview.view.getURL());
		if (!OhHaiBrowser.validate.internalpage(_Tabview.url)){
			//This is not an internal page.
      		if(!_Tabview.tab.classList.contains("IncognitoTab")){
				if(_Tabview.favIcon == 'system_assets/icons/loader.gif'){_Tabview.favIcon = "";}

        		History.GetLastItem(function(lastitem){
          			if(lastitem == undefined){
            			History.Add(_Tabview.url, _Tabview.title, _Tabview.favIcon, OhHaiBrowser.validate.hostname(_Tabview.url));
          			}else{
            			if(lastitem.url != _Tabview.url){
              				History.Add(_Tabview.url, _Tabview.title, _Tabview.favIcon, OhHaiBrowser.validate.hostname(_Tabview.url));
            			}
          			}		
        		});
      		}
		}
    });
    _Tabview.view.addEventListener("load-commit", function(e) {
        if(_Tabview.selected){
			//only kick event if the mainframe is loaded, no comments or async BS!
			if(e.isMainFrame){
				//is doodle already open? - we dont want to bug the users so much. - Actully we shouldnt need to check...Doodle should know.
				Doodle.DEPLOY(_Tabview.view);
			}
		}
    });
    _Tabview.view.addEventListener("page-title-updated", function() {
        UpdateTab(_Tabview);
    });
    _Tabview.view.addEventListener("dom-ready", function() {
		domloaded(_Tabview);
		UpdateTab(_Tabview);

		if(!_Tabview.tab.classList.contains("IncognitoTab")){
			Sessions.UpdateWebPage(_Tabview.id, _Tabview.url, _Tabview.title, _Tabview.favIcon ,function(id){});
		}

		var webviewcontent = _Tabview.view.getWebContents();	
		webviewcontent.on("context-menu", (e, params) => {
			e.preventDefault()
			var WbMen = OhHaiBrowser.ui.contextmenus.webview(_Tabview.view,webviewcontent,params);
			WbMen.popup(remote.getCurrentWindow())
		});
    });
    _Tabview.view.addEventListener("did-fail-load", function (e) {
        if (e.errorCode != -3 && e.validatedURL == e.target.getURL()) {
            _Tabview.view.loadURL(OhHaiBrowser.builtInPages.errorPage + "?code=" + e.errorCode + "&url=" + e.validatedURL);
        }
    });
    _Tabview.view.addEventListener("close", function() {
        _Tabview.remove();
    });
    _Tabview.view.addEventListener("new-window", function(e) {
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
    _Tabview.view.addEventListener("media-started-playing", function (e) {
        if(_Tabview.view.isAudioMuted()){
			tab_MediaBtn.classList.add("tabMute");
			tab_MediaBtn.classList.remove("hidden");
		}else{
			tab_MediaBtn.classList.add("tabPlaying");
			tab_MediaBtn.classList.remove("hidden");
		}
    })
    _Tabview.view.addEventListener("media-paused", function (e) {
        if(_Tabview.view.isAudioMuted()){
			tab_MediaBtn.classList.add("tabMute");
			tab_MediaBtn.classList.remove("hidden");
		}else{
			tab_MediaBtn.classList.add("tabPlaying");
			tab_MediaBtn.classList.remove("hidden");
		}
    });
    _Tabview.view.addEventListener("page-favicon-updated",function(e){
        _Tabview.favIcon = e.favicons[0];
    });
    _Tabview.view.addEventListener('focus',function(e){
        OhHaiBrowser.ui.overflowmenu.setvis(false);
    });

    // Tab Events
    _Tabview.tab.addEventListener("click", function(e) {
        switch(e.target.className){
     		case "TabClose":
				 _Tabview.remove();
				break;
			case "tabPlaying":
				_Tabview.view.setAudioMuted(true);
				break;
			case "tabMute":
				_Tabview.view.setAudioMuted(false);
				break;
              default:
				OhHaiBrowser.tabs.setCurrent(_Tabview.tab, _Tabview.view);
				OhHaiBrowser.ui.navbar.updateURLBar(_Tabview.view);
    	}
    });
    _Tabview.tab.addEventListener('contextmenu', (e) => {
        e.preventDefault()
		var TbMen = OhHaiBrowser.ui.contextmenus.tab(_Tabview.tab, _Tabview.view, _Tabview.title, _Tabview.tab.querySelector('.TabClose'));
		TbMen.popup(remote.getCurrentWindow())
	}, false);
}

function domloaded(_Tabview){
    _Tabview.url = _Tabview.view.getURL();
    _Tabview.title = _Tabview.view.getTitle();

	if(_Tabview.selected){
		OhHaiBrowser.ui.navbar.updateURLBar(_Tabview.view);
		$('#SecureCheck').removeClass("Loading");
		//check if this site is a qlink
		OhHaiBrowser.bookmarks.check(_Tabview.view.getURL(),function(returnval){
			OhHaiBrowser.bookmarks.updateBtn(returnval);
		});
	}
}

function UpdateTab(_Tabview){
    _Tabview.title = _Tabview.view.getTitle();
	_Tabview.favIcon = `file://${__dirname}/system_assets/icons/favicon_default.png`;
}


module.exports = TabView;
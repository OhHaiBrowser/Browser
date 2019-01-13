var TabList = document.getElementById("tabs-menu");
//Create TabControl
//-----------------------------------------------------------------------
var tabs = {
	getSelected: function(){
		var x = document.getElementsByClassName("current");
		return x[0]; //This is the current selected tab.
	},
	AddToGroup: function(_tab,_group){
		if(_group == null){
			//New Group
			OhHaiBrowser.tabs.groups.add(null,null,_tab);
		}else{
			//Existing group
			var GroupChildren = _group.querySelector('.ohhai-group-children');
			GroupChildren.appendChild(_tab);

			var TabSessionId = _tab.getAttribute("data-session");
			Sessions.UpdateParent(TabSessionId,_group.id,function(id){console.log("AddToGroup - Parent updated:" + _group.id);});		
		}
	},
	RemoveFromGroup: function(_tab){
		var thisGroupList = _tab.parentElement;
		var thisGroup = thisGroupList.parentElement;

		TabList.appendChild(_tab);		

		var TabSessionId = _tab.getAttribute("data-session");
		Sessions.UpdateParent(TabSessionId,TabList.id,function(id){console.log("RemoveFromGroup - Parent updated:" + _group.id);});

		if(thisGroupList.children.length == 0){
			tabs.RemoveGroup(thisGroup);
		}
	},
	RemoveGroup: function(Group){
		var GroupTabs = Group.querySelector('.ohhai-group-children');
		var GroupParent = Group.parentElement;

		GroupParent.removeChild(Group);

		Groups.Remove(Group.id,function(result){});
	}
}

//Functions for webview events
//-------------------------------------------------------------------
function AddListeners(webview,fulltab,tabimg,tabtext,ControlsId){

	webview.addEventListener("did-start-loading", function() {
		if(OhHaiBrowser.tabs.isCurrent(fulltab)){
			loadstart(tabtext,tabimg,webview);
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
				//tabs.add(e.url,"default");
				OhHaiBrowser.tabs.add(e.url,undefined,{selected: true});
		}
	});
	
  	webview.addEventListener("media-started-playing", function (e) {
		var PlayPauseBtn = fulltab.querySelector('.tabMediaBtn');

		
	});
	webview.addEventListener("media-paused", function (e) {
		var PlayPauseBtn = fulltab.querySelector('.tabMediaBtn');


	});

	webview.addEventListener("page-favicon-updated",function(e){
		tabimg.src= e.favicons[0];
	});
  	webview.addEventListener('focus',function(e){
		$("#OverFlowMenu").animate({ height: 'hide' }, 150);
	});

	//Tab Listeners
	fulltab.addEventListener("click", function(e) {
    	switch(e.target.className){
     		case "TabClose":
				 OhHaiBrowser.tabs.remove(fulltab);
				break;
			case "PlayingMedia":
				webview.setAudioMuted(true);
				break;
			case "PausedMedia":
				webview.setAudioMuted(false);
				break;
			  default:
				  OhHaiBrowser.tabs.setCurrent(fulltab,webview);
				  OhHaiBrowser.ui.navbar.updateURLBar(webview);
        		//tabs.setSelected(fulltab,webview);
        		//tabs.updateURLBar(webview);
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

let AboutMenu = require('./system_assets/scripts/addons/about.js'),
BookmarkMenu = require('./system_assets/scripts/addons/bookmarks.js'),
SettingsMenu = require('./system_assets/scripts/addons/settings.js'),
HistoryMenu = require('./system_assets/scripts/addons/history.js'),
UrlService = require('./system_assets/services/navbar.js');
MegaOverFlowContent = document.getElementById("MegaMenuContent"),
launchparams = remote.getGlobal('sharedObject').prop1,
IsLaunchParam = function(){if(launchparams.length == 1){return false}else{return true}};

Settings.Get("FirstRun",function(i){
	if(i == undefined){
		//this is a new user! - Show them the setup page
		Settings.Set("FirstRun",Date.now(),function(c){});
	}
});

//var arguments = launchparams.split(",");
Settings.Get("Launch",function(item){
	if(item != undefined){
		switch (item.value) {
		case "fresh":
				//Fresh session
				if(!IsLaunchParam){
					OhHaiBrowser.tabs.add(OhHaiBrowser.settings.homepage,undefined,{selected: true});
				}
		break;
		default:
			//Old session
			Groups.Get(function(Glist){
				if(Glist.length != 0){
					for(g in Glist){
						OhHaiBrowser.tabs.groups.add(Glist[g].groupid,Glist[g].name,"session");
					}	
				}
				Sessions.Get(function(Slist){
					if(Slist.length != 0){
				  	for(s in Slist){
					  	OhHaiBrowser.tabs.add(Slist[s].url,Slist[s].sessionid,{selected: true,mode:Slist[s].mode,parent:Slist[s].parent, title: Slist[s].title});
				  	}
					}else{
						//No session
						if(!IsLaunchParam){
							OhHaiBrowser.tabs.add(OhHaiBrowser.settings.homepage,undefined,{selected: true});
				  	}
					}
		   	});
			});
		}
	}
	else{
		Groups.Get(function(Glist){
			if(Glist.length != 0){
				for(g in Glist){
					OhHaiBrowser.tabs.groups.add(Glist[g].groupid,Glist[g].name,"session");
				}	
			}
			Sessions.Get(function(Slist){
				if(Slist.length != 0){
				  for(s in Slist){
						OhHaiBrowser.tabs.add(Slist[s].url,Slist[s].sessionid,{selected: true,mode:Slist[s].mode,parent:Slist[s].parent, title: Slist[s].title});
				  }
				}else{
					OhHaiBrowser.tabs.add("default",undefined,{selected: true});
				}
		   });
		});
	}
});
if (IsLaunchParam){
	console.log("Launch param: " + launchparams[1]);
	OhHaiBrowser.validate.url(launchparams[1], function(valresult){
		if(valresult == true){
			//tabs.add(launchparams[1],"default");
			OhHaiBrowser.tabs.add(launchparams[1],undefined,{selected: true});
		}
	});
}

OhHaiBrowser.bookmarks.load();
OhHaiBrowser.history.load();
//Settings.Get("Theme",function(item){
//	if(item != undefined){
//		OhHaiBrowser.ui.theme.load(item.value);
//	}
//});

Settings.Get("TabBar",function(item){
	if(item != undefined){
		if(item.value == false){
			OhHaiBrowser.ui.tabbar.panel.classList.add("LeftMenuHidden");
			OhHaiBrowser.ui.tabbar.panel.classList.remove("LeftMenuShow");
			OhHaiBrowser.ui.tabbar.pined = false;
		}else{
			OhHaiBrowser.ui.tabbar.pined = true;
		}
	}
});

$(function() {
	$( "#VideoPlayer" ).draggable({
		containment: "parent"
	});
});

//Left Controls
//-------------------------------------------------------------------------------------------------------------------------
OhHaiBrowser.ui.tabbar.panel.addEventListener('contextmenu', (e) => {
	switch(e.target.className){
		case "CommandBtn AddTab":
		case "OhHai-TabMenu":
			//Everythig which isnt a tab
			var TbMen = OhHaiBrowser.ui.contextmenus.tabmenu();
			e.preventDefault()
			TbMen.popup(remote.getCurrentWindow())
		break;
	}
}, false);

function AddTabButton(){
	OhHaiBrowser.tabs.add(OhHaiBrowser.settings.homepage,undefined,{selected: true});
}

//--------------------------------------------------------------------------------------------------------------
//URL bar functions
OhHaiBrowser.ui.navbar.txt_urlBar.addEventListener('contextmenu', (e) => {
	e.preventDefault()	
	var URlMenu = OhHaiBrowser.ui.contextmenus.urlbar(OhHaiBrowser.ui.navbar.txt_urlBar);
	URlMenu.popup(remote.getCurrentWindow())
}, false);

let urlbarValid = {};
OhHaiBrowser.ui.navbar.txt_urlBar.addEventListener('keydown', function(event) {
	//Check validity of URL content
	UrlService(this.value, (resp) => {
		urlbarValid = resp;
	});
	//On Enter
	if(event.which == 13){
		OhHaiBrowser.tabs.activePage.navigate(urlbarValid.output);		
	}
});

//mouse event
var URLOuter = document.getElementById("URLBackColour");

OhHaiBrowser.ui.navbar.txt_urlBar.addEventListener("click", function(e) {
    if(OhHaiBrowser.ui.navbar.txt_urlBar.value != OhHaiBrowser.ui.navbar.txt_urlBar.getAttribute("data-text-swap")){
        OhHaiBrowser.ui.navbar.txt_urlBar.value = OhHaiBrowser.ui.navbar.txt_urlBar.getAttribute("data-text-swap");
    }
});

OhHaiBrowser.ui.navbar.txt_urlBar.addEventListener("focus",function(e){
	URLOuter.classList.add("CenterFocus");
});

OhHaiBrowser.ui.navbar.txt_urlBar.addEventListener("focusout", function (e) {
	OhHaiBrowser.ui.navbar.txt_urlBar.value = OhHaiBrowser.ui.navbar.txt_urlBar.getAttribute("data-text-original");
	URLOuter.classList.remove("CenterFocus");
});


//-----------------------------------------------------------------------------------------------------

OhHaiBrowser.ui.navbar.btn_bookmark.addEventListener("click", function(e) {
	var popuplocation = {'left':e.currentTarget.offsetLeft,'top':e.currentTarget.offsetTop};
	if(OhHaiBrowser.ui.navbar.btn_bookmark.classList.contains("QuicklinkInactive")){
		//Add new bookmark
		OhHaiBrowser.tabs.getCurrent(function(cTab){
			var CurrentWebView = document.getElementById(cTab.getAttribute("data-container"));
			OhHaiBrowser.bookmarks.add(CurrentWebView.getTitle(),CurrentWebView.getURL(),"","",popuplocation,function(newqlink){}) ;	
		});
	}else{
		//Remove bookmark
		var ThisId = Number(OhHaiBrowser.ui.navbar.btn_bookmark.getAttribute("data-id"));
		Quicklinks.Remove(ThisId,function(e){
			if(e != 0){
				OhHaiBrowser.bookmarks.btn_bookmark.setAttribute("data-id","");
				OhHaiBrowser.bookmarks.btn_bookmark.classList.remove("QuicklinkActive");
				OhHaiBrowser.bookmarks.btn_bookmark.classList.add("QuicklinkInactive");
			}
		});
	}
});

//Right Controls
//-------------------------------------------------------------------------------------------------------------------------
OhHaiBrowser.ui.overflowmenu.panel.addEventListener("click", function(e) {
	e.stopPropagation();
});

$(document).click(function(e) {
	OhHaiBrowser.ui.overflowmenu.setvis(false);
});

var menu = {
	mega: function(loadfunction,MenuTitle){

		if(MegaOverFlowContent.lastChild){
			MegaOverFlowContent.removeChild(MegaOverFlowContent.lastChild);
		}

		OhHaiBrowser.ui.overflowmenu.items.overflowDeepMenuTitle.textContent = MenuTitle;
		//Load content into menu area
		MegaOverFlowContent.appendChild(loadfunction);		

		//Show menu area
		OhHaiBrowser.ui.overflowmenu.items.overflowOptionsMenu.style.display = 'none';
		OhHaiBrowser.ui.overflowmenu.items.overflowDeepMenu.style.display = '';
	},
	hide: function(){
		OhHaiBrowser.ui.overflowmenu.items.overflowDeepMenu.style.display = 'none';
		OhHaiBrowser.ui.overflowmenu.items.overflowOptionsMenu.style.display = '';
		MegaOverFlowContent.removeChild(MegaOverFlowContent.lastChild);
	}
}



function initAccordion(accordionElem){
  
  //when panel is clicked, handlePanelClick is called.          
  function handlePanelClick(event){
      showPanel(event.currentTarget);
  }
//Hide currentPanel and show new panel.  
  
  function showPanel(panel){
    //Hide current one. First time it will be null. 
     var expandedPanel = accordionElem.querySelector(".acc_active");
     if (expandedPanel){
         expandedPanel.classList.remove("acc_active");
     }
     //Show new one
     panel.classList.add("acc_active");
  }
  var allPanelElems = accordionElem.querySelectorAll(".acc_panel");
  for (var i = 0, len = allPanelElems.length; i < len; i++){
       allPanelElems[i].addEventListener("click", handlePanelClick);
  }
  //By Default Show first panel
  showPanel(allPanelElems[0])
}
initAccordion(document.getElementById("leftAccordion"));
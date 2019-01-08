var MegaOverFlowContent = document.getElementById("MegaMenuContent");
var MiniOverFlowContent = document.getElementById("MiniMenuContent");

//CreateTabOnLoad
var launchparams = remote.getGlobal('sharedObject').prop1;
var IsLaunchParam = function(){if(launchparams.length == 1){return false}else{return true}};

//var arguments = launchparams.split(",");
Settings.Get("Launch",function(item){
	if(item != undefined){
		switch (item.value) {
		case "fresh":
			console.log("Fresh Session");
				if(!IsLaunchParam){
					//tabs.add(OhHaiBrowser.settings.homepage(),"default");
					OhHaiBrowser.tabs.add(OhHaiBrowser.settings.homepage(),undefined,{selected: true});
				}
			break;
		default:
		console.log("Use old session");
		Groups.Get(function(Glist){
			if(Glist.length != 0){
				for(g in Glist){
					OhHaiBrowser.tabs.groups.add(Glist[g].groupid,Glist[g].name,"session");
				}	
			}
			Sessions.Get(function(Slist){
				if(Slist.length != 0){
				  for(s in Slist){
					  //tabs.add(Slist[s].url,Slist[s].mode,Slist[s].sessionid,Slist[s].parent);
					  OhHaiBrowser.tabs.add(Slist[s].url,Slist[s].sessionid,{selected: true,mode:Slist[s].mode,parent:Slist[s].parent});
				  }
				}else{
					//No session
					if(!IsLaunchParam){
						//tabs.add(OhHaiBrowser.settings.homepage(),"default");
						OhHaiBrowser.tabs.add(OhHaiBrowser.settings.homepage(),undefined,{selected: true});
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
					  //tabs.add(Slist[s].url,Slist[s].mode,Slist[s].sessionid,Slist[s].parent);
					OhHaiBrowser.tabs.add(Slist[s].url,Slist[s].sessionid,{selected: true,mode:Slist[s].mode,parent:Slist[s].parent});
				  }
				}else{
					 //tabs.add("default","default");
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

Settings.Get("Theme",function(item){
	if(item != undefined){
		OhHaiBrowser.ui.theme.load(item.value);
	}
});

Settings.Get("TabBar",function(item){
	if(item != undefined){
		if(item.value == false){
			OhHaiBrowser.ui.tabbar.pined = false;
			$("#LeftMenu").animate({ width: 'hide' }, 150);
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
	OhHaiBrowser.tabs.add(OhHaiBrowser.settings.homepage(),undefined,{selected: true});
}

//--------------------------------------------------------------------------------------------------------------
//URL bar functions
OhHaiBrowser.ui.navbar.txt_urlBar.addEventListener('contextmenu', (e) => {
	e.preventDefault()	
	var URlMenu = OhHaiBrowser.ui.contextmenus.urlbar(OhHaiBrowser.ui.navbar.txt_urlBar);
	URlMenu.popup(remote.getCurrentWindow())
}, false);

OhHaiBrowser.ui.navbar.txt_urlBar.addEventListener('keydown', function(event) {
	if(event.which == 13){
		OhHaiBrowser.validate.url(OhHaiBrowser.ui.navbar.txt_urlBar.value,function(isurl){
			if(isurl == true){
				OhHaiBrowser.tabs.activePage.navigate(OhHaiBrowser.ui.navbar.txt_urlBar.value);
			}else{
				OhHaiBrowser.validate.url('http://' + OhHaiBrowser.ui.navbar.txt_urlBar.value,function(isotherurl){
					if(isotherurl == true){
						OhHaiBrowser.tabs.activePage.navigate('http://'+ OhHaiBrowser.ui.navbar.txt_urlBar.value);
					}else{
						currenttab.Navigate(OhHaiBrowser.settings.search() + OhHaiBrowser.ui.navbar.txt_urlBar.value);
					}
				});
			}
		});
	}
});

//mouse event
OhHaiBrowser.ui.navbar.txt_urlBar.addEventListener("click", function(e) {
    if(OhHaiBrowser.ui.navbar.txt_urlBar.value != OhHaiBrowser.ui.navbar.txt_urlBar.getAttribute("data-text-swap")){
        OhHaiBrowser.ui.navbar.txt_urlBar.value = OhHaiBrowser.ui.navbar.txt_urlBar.getAttribute("data-text-swap");
    }
});

OhHaiBrowser.ui.navbar.txt_urlBar.addEventListener("focusout", function (e) {
	OhHaiBrowser.ui.navbar.txt_urlBar.value = OhHaiBrowser.ui.navbar.txt_urlBar.getAttribute("data-text-original");
});
//-----------------------------------------------------------------------------------------------------

$("#BtnPageAction").click(function(e){
	$("#OverFlowMenu").animate({ height: 'show' }, 150);
	menu.mega(webmods_0000000001.Load(),'Webmods');
	e.stopPropagation();
});

$("#BtnQuicklink").click(function(e){
	if($("#BtnQuicklink").hasClass("QuicklinkInactive")){
		OhHaiBrowser.tabs.getCurrent(function(cTab){
			var CurrentWebView = document.getElementById(cTab.getAttribute("data-container"));
			OhHaiBrowser.bookmarks.add(CurrentWebView.getTitle(),CurrentWebView.getURL(),"","",function(newqlink){
				if(newqlink != null){
					$("#BtnQuicklink").attr("data-id",newqlink);
					$("#BtnQuicklink").removeClass("QuicklinkInactive");
					$("#BtnQuicklink").addClass("QuicklinkActive");	
					$("#PageActionsMenu").fadeOut(300);
				}else{
					//Error
				}
			});	

		});	
	}else{
		var ThisId = Number($("#BtnQuicklink").attr("data-id"));
		Quicklinks.Remove(ThisId,function(e){
			if(e != 0){
				$("#BtnQuicklink").removeClass("QuicklinkActive");
				$("#BtnQuicklink").addClass("QuicklinkInactive");	
				$("#BtnQuicklink").attr("data-id","");
			}
		});
	}
});

//Right Controls
//-------------------------------------------------------------------------------------------------------------------------

function BrowserSettingsMenu(){
	$("#OverFlowMenu").animate({ height: 'toggle' }, 150);
	$("#PageActionsMenu").fadeOut(150);

	$("#OverFlowOptions").show();
	$("#OverFlowDeepMenu").hide();	
	
	event.stopPropagation();
}

$("#Menu").click(function(e){

});

$("#OverFlowMenu").click(function(e){
	e.stopPropagation();
});

$(document).click(function(e) {
	$("#OverFlowMenu").animate({ height: 'hide' }, 150);
	$("#PageActionsMenu").fadeOut(150);

	//MegaOverFlowContent.removeChild(MegaOverFlowContent.lastChild);
});

var menu = {
	mega: function(loadfunction,MenuTitle){

		if(MegaOverFlowContent.lastChild){
			MegaOverFlowContent.removeChild(MegaOverFlowContent.lastChild);
		}

		//MegaOverFlowContent.appendChild("");
		$("#MenuTitle").text(MenuTitle);
		//Load content into menu area
		MegaOverFlowContent.appendChild(loadfunction);
		

		//Show menu area
		$("#OverFlowOptions").hide();
		$("#OverFlowDeepMenu").show();
	},
	app: function(src,title){


		//MegaOverFlowContent.appendChild("");
		$("#MenuTitle").text(title);

		//Show menu area
		$("#OverFlowOptions").hide();
		$("#OverFlowDeepMenu").show();
	},
	webview: function(src,title){
		//Load content into menu area
		var menuview = document.createElement('webview')
		menuview.setAttribute("src",src);
		menuview.setAttribute("style","height:100%;");
	
		MegaOverFlowContent.appendChild(menuview);
		$("#MenuTitle").text(title);

		//Show menu area
		$("#OverFlowOptions").hide();
		$("#OverFlowDeepMenu").show();
	},
	mini: function(loadfunction){
		//Load content into mini area
		MiniOverFlowContent.appendChild(loadfunction);

		$("#OverFlowOptions").hide();
		$("#OverFlowMiniMenu").show();
	},
	normal: function(){

	},
	none: function(){
		//This is an intreresting one- come back to this.
	},
	hide: function(menutype){
		switch(menutype){
			case "mega":
				$("#OverFlowDeepMenu").hide();
				$("#OverFlowOptions").show();
				MegaOverFlowContent.removeChild(MegaOverFlowContent.lastChild);
				break;
			case "mini":
				$("#OverFlowMiniMenu").hide();
				$("#OverFlowOptions").show();
				MiniOverFlowContent.removeChild(MiniOverFlowContent.lastChild);
				break;
			case "normal":
				$("#OverFlowMenu").animate({ height: 'hide' }, 150);
				break;
		}
	}
}

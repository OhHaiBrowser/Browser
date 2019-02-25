var {clipboard,remote} = require('electron');
var {Menu, MenuItem} = remote;

var OhHaiBrowser = {
	sessionStartTime: "",
	sessionDuration: function(){return Date.now() - OhHaiBrowser.sessionStartTime;},
	builtInPages: {
		home : `file://${__dirname}/system_assets/components/home_page/index.html`,
		settings : `file://${__dirname}/system_assets/builtin-pages/settings.html`,
		history : `ile://${__dirname}/system_assets/components/history_page/index.html`,
		bookmarks : `file://${__dirname}/system_assets/builtin-pages/quiclinks.html`,
		errorPage : `file://${__dirname}/system_assets/components/error_page/index.html`
	},
	templates: {
		websession: function(_ID,_URL,callback){
			var tabelement = `
				<li class='tab' title=''>
					<a class='tabMediaBtn hidden'></a>
					<img class='ohhai-tab-fav' src='system_assets/icons/logo.png'/>
					<span class='ohhai-tab-txt'>New Tab</span>
					<a class='TabClose'></a>
				</li>`;
			var div = document.createElement('div');
      div.innerHTML = tabelement
      div.firstElementChild.setAttribute("id","t_" + _ID);
			div.firstElementChild.setAttribute("data-container","wv_" + _ID);

			var ThisView = document.createElement("webview");
			ThisView.id = "wv_" + _ID;
			ThisView.classList.add("Hidden");

			var PagetoOpen = "";
			switch(_URL){
				case "settings":
				  PagetoOpen = OhHaiBrowser.builtInPages.settings;
				break;
				case "history":
				  PagetoOpen = OhHaiBrowser.builtInPages.history;
				break;
				case "quicklinks":
				  PagetoOpen = OhHaiBrowser.builtInPages.bookmarks;
				break;
				case "default":
				case undefined:
				case "":
				  PagetoOpen = OhHaiBrowser.builtInPages.home;
				break;
				default:
					PagetoOpen = _URL;
			}
			ThisView.src = PagetoOpen;  

			callback({tab:div.firstElementChild, webview:ThisView});
		},
		group:function(_ID,_Title,callback){
			var grouptemplate = `
				<li class='group' title=''>
					<div class='ohhai-group-header'>
						<input type='text' class='ohhai-group-txt' value='New Group'/>
						<a class='ohhai-togglegroup'></a>
					</div>
					<ul class='ohhai-group-children'>
					</ul>
				</li>`;
			var div = document.createElement('div');
			div.innerHTML = grouptemplate;
			 
			div.firstElementChild.setAttribute("id",_ID);

			var Group = div.firstElementChild;
			var GroupHead = Group.querySelector(".ohhai-group-header");
			var GroupName = Group.querySelector('.ohhai-group-txt');
			var ToggleGroup = Group.querySelector('.ohhai-togglegroup');
			var GroupChildren = Group.querySelector('.ohhai-group-children');

			if(_Title != null){
				Group.querySelector('.ohhai-group-txt').value = _Title;
			}

			ToggleGroup.addEventListener("click", function(e) {
				$(GroupChildren).toggle();
			});
			GroupName.addEventListener("change",function(){
				Groups.Upsert(Group.id,GroupName.value,function(id){});
			});
			GroupHead.addEventListener('contextmenu', (e) => {
				e.preventDefault()
				var GroupMenu = OhHaiBrowser.ui.contextmenus.group(Group,GroupChildren);
				GroupMenu.popup(remote.getCurrentWindow())
			}, false)

			if(typeof callback == "function"){
				callback(div.firstElementChild);
			}
		}
	},
	tabs: {
		count:0,
		add: function(_URL,_ID,_OPTIONS,callback){
			var ThisTab, ThisWebview,IsNew = false;
			if(_ID == undefined){_ID = OhHaiBrowser.core.generateId();IsNew = true;}

			OhHaiBrowser.templates.websession(_ID,_URL,function(NewWS){
				//Add fuctionality
				AddListeners(NewWS.webview,NewWS.tab,NewWS.tab.querySelector('.ohhai-tab-fav'),NewWS.tab.querySelector('.ohhai-tab-txt'),_ID);

				//Are there options?
				if(_OPTIONS){
					if(_OPTIONS.selected == true){
						OhHaiBrowser.tabs.setCurrent(NewWS.tab,NewWS.webview);
					}
					if(_OPTIONS.mode){
						switch(_OPTIONS.mode.toString().toLowerCase()){
							case "dock":
								OhHaiBrowser.ui.tabbar.pinnedtabcontainer.appendChild(NewWS.tab);
							break;
							case "incog":
								NewWS.tab.classList.add("IncognitoTab");
								OhHaiBrowser.ui.tabbar.tabcontainer.appendChild(NewWS.tab);
							break;
							case "grouped":
								if(_OPTIONS.parent){
									if(typeof _OPTIONS.parent == "string"){_OPTIONS.parent = document.getElementById(_OPTIONS.parent);}
									if(_OPTIONS.parent != null){
										if(_OPTIONS.parent.classList.contains("ohhai-group-children")){
											_OPTIONS.parent.appendChild(NewWS.tab);
										}else{
											var GroupedTabs = _OPTIONS.parent.querySelector('.ohhai-group-children');
											GroupedTabs.appendChild(NewWS.tab);
										}
									}else{
										OhHaiBrowser.ui.tabbar.tabcontainer.appendChild(NewWS.tab);
									}		
								}else{
									_OPTIONS.parent.appendChild(NewWS.tab);
								}
							break;
							case "default":
							default:
								OhHaiBrowser.ui.tabbar.tabcontainer.appendChild(NewWS.tab);
						}
					}else{
						_OPTIONS.mode = "default";
						OhHaiBrowser.ui.tabbar.tabcontainer.appendChild(NewWS.tab);
					}
					if(_OPTIONS.title){
						var tabTxt = NewWS.tab.querySelector('.ohhai-tab-txt');
						tabTxt.textContent = _OPTIONS.title;
					}
					if(_OPTIONS.favicon){
						var tabFav = NewWS.tab.querySelector('.ohhai-tab-fav');
						tabFav.src = _OPTIONS.favicon;
					}
				}else{
					//load basic defaults
					OhHaiBrowser.ui.tabbar.tabcontainer.appendChild(NewWS.tab);
				}
				OhHaiBrowser.ui.tabbar.webviewcontainer.appendChild(NewWS.webview);

				if(!NewWS.tab.classList.contains("IncognitoTab")){
					if(IsNew){
						var TabParent = null;
						switch(NewWS.tab.parentElement.className){
							case "ohhai-group-children":
								var FirstTabParent = NewWS.tab.parentElement;
								TabParent = FirstTabParent.parentElement.id;
							break;
							default:
							TabParent = NewWS.tab.parentElement.id;
						}
		
						Sessions.Set(_ID,"default","TempTitle",_OPTIONS.mode,"system_assets/icons/logo.png",function(id){
							if(id != null){
								NewWS.tab.setAttribute("data-session",_ID);
								Sessions.UpdateParent(_ID,TabParent,function(id){});
							}
						});
					}else{
						NewWS.tab.setAttribute("data-session",_ID);
					}
				}

				OhHaiBrowser.tabs.count++;
				OhHaiBrowser.ui.navbar.updateTabCounter();
				
				if (typeof callback === "function") {
					callback(NewWS);
				}
			});			
		},
		remove: function(_TAB,callback){
			var ThisWebView = document.getElementById(_TAB.getAttribute("data-container"));
			var Parent = _TAB.parentElement;
			var webviewParent = document.getElementById("BrowserWin");

			if(OhHaiBrowser.tabs.count > 1){
				if(OhHaiBrowser.tabs.isCurrent(_TAB)){
					var Open_Tabs = document.querySelectorAll("li.tab");
					var This_TabIndex;
					Open_Tabs.forEach(function(ArrayElement,index){if(ArrayElement == _TAB){This_TabIndex = index;}});
						
					if((Open_Tabs.length -1) == This_TabIndex){
						//Go in a tab
						OhHaiBrowser.tabs.setCurrent(Open_Tabs[This_TabIndex - 1],null,null);
					}else{
						//Select next tab
						OhHaiBrowser.tabs.setCurrent(Open_Tabs[This_TabIndex + 1],null,null);
					}

					//need to update the URL now
					OhHaiBrowser.tabs.getCurrent(function(NewTab){
						var newWebview = document.getElementById(NewTab.getAttribute("data-container"));
						OhHaiBrowser.ui.navbar.updateURLBar(newWebview);
					});
				}
		
			}

			Parent.removeChild(_TAB);
			webviewParent.removeChild(ThisWebView);

			if(Parent.classList.contains("ohhai-group-children")){
				var ThisGroup = Parent.parentElement;
				if(Parent.children.length == 0){
					OhHaiBrowser.tabs.groups.remove(ThisGroup,null,null);
					//OhHaiBrowser.tabs.RemoveGroup(ThisGroup);
				}
			}	
			OhHaiBrowser.tabs.count--;
			OhHaiBrowser.ui.navbar.updateTabCounter();
	
			if (OhHaiBrowser.tabs.count == 0){
				OhHaiBrowser.tabs.add(OhHaiBrowser.settings.homepage(),undefined,{selected: true});
			}
	
			if(!_TAB.classList.contains("IncognitoTab")){
				Sessions.Remove(_TAB.getAttribute("data-session"),function(result){});
			}

			if(typeof callback == "function"){
				callback(true);
			}
		},
		get: function(tabid,callback){
			callback(tabEl.querySelector('#' + tabid));
		},
		isCurrent: function(_Tab){
			var x = document.getElementsByClassName("current")[0];
			if(_Tab == x){return true;}else{return false;}
		},
		getCurrent: function(callback){
			var x = document.getElementsByClassName("current");
			if (typeof callback === "function") {
				callback(x[0]);
			}
		},
		setCurrent: function(tab,webview,callback){
			OhHaiBrowser.tabs.getCurrent(function(ctab){
				if(ctab){
					ctab.classList.remove("current");
					var oldtabwv = document.getElementById(ctab.getAttribute("data-container"));
					oldtabwv.classList.add("Hidden");
				}
			});
			var tabwv = document.getElementById(tab.getAttribute("data-container"));
			tab.classList.add("current");
			if(webview != null){
				webview.classList.remove("Hidden");
			}else{
				tabwv.classList.remove("Hidden");
			}

			if (typeof callback === "function") {
				callback(true);
			}
		},
		ismode:function(_tab,_mode,callback){
			var returnval = false;
			switch(_mode){
				case "docked":
					if(_tab.parentNode.id == "tabs-dock"){
						returnval = true;
					}
				break;
				case "grouped":
					if(_tab.parentNode.className == 'ohhai-group-children'){
						returnval = true;
					}
				break;
				case "default":
				default:
					if(_tab.parentNode.id == "tabs-menu"){
						returnval = true;
					}	
			}
			if(typeof callback == "function"){
				callback(returnval);
			}			
		},
		setMode:function(_tab,_mode,callback){	
			var TabSessionId = _tab.getAttribute("data-session");
			var Tab_Text = _tab.querySelector(".ohhai-tab-txt");
			var Tab_CloseBtn = _tab.querySelector('.TabClose');

			switch(_mode){
				case "docked":
					Tab_Text.style.display = "none";
					Tab_CloseBtn.style.display = "none";
					OhHaiBrowser.ui.tabbar.pinnedtabcontainer.appendChild(_tab);
					Sessions.UpdateMode(TabSessionId,"DOCK",function(){});
					Sessions.UpdateParent(TabSessionId,OhHaiBrowser.ui.tabbar.pinnedtabcontainer.id,function(){});
				break;
				case "grouped":

				break;
				case "default":
				default:
					Tab_Text.style.display = "block";
					Tab_CloseBtn.style.display = "block";
					OhHaiBrowser.ui.tabbar.tabcontainer.appendChild(_tab);
					Sessions.UpdateMode(TabSessionId,"Default",function(){});
					Sessions.UpdateParent(TabSessionId,OhHaiBrowser.ui.tabbar.tabcontainer.id,function(){});
			}
		},
		executeScript: function(tabid,code,callback){
			OhHaiBrowser.tabs.get(tabid,function(cTab){
				var CurrentWebView = document.getElementById(cTab.getAttribute("data-container"));
				CurrentWebView.executeJavaScript(code);
			});
			callback("request sent");
		},
		insertCSS: function(tabid,code,callback){
			OhHaiBrowser.tabs.get(tabid,function(cTab){
				var CurrentWebView = document.getElementById(cTab.getAttribute("data-container"));
				CurrentWebView.insertCSS(code);
			});
			callback("request sent");
		},
		reload: function(tabid,callback){
			OhHaiBrowser.tabs.get(tabid,function(cTab){
				var CurrentWebView = document.getElementById(cTab.getAttribute("data-container"));
				CurrentWebView.reload();
			});
			callback("request sent");
		},
		groups:{			
			add:function(_id,_title,_tab,callback){
				var this_group;
				if(_id == null){_id = "group-"+ OhHaiBrowser.core.generateId();}
				OhHaiBrowser.templates.group(_id,_title,function(newGroup){
					this_group = newGroup;
					var this_groupChildren = this_group.querySelector('.ohhai-group-children');
					var this_groupName = this_group.querySelector('.ohhai-group-txt');

					switch(_tab){
						case null:
						//tabs.add('default','default',null,GroupChildren);
						OhHaiBrowser.tabs.add(OhHaiBrowser.settings.homepage(),undefined,{selected: true,mode:"grouped",parent:this_groupChildren});
						break;
						case "session":
						break;
						default:
						var TabSessionId = _tab.getAttribute("data-session");
						this_groupChildren.appendChild(_tab);	
						Sessions.UpdateParent(TabSessionId,this_group.id,function(_id){console.log("NewGroup - Parent updated: " + this_group.id);});
					}
					OhHaiBrowser.ui.tabbar.tabcontainer.appendChild(this_group);

					Groups.Upsert(this_group.id,this_groupName.value,function(_id){});
				});

				if(typeof callback =="function"){
					callback(this_group);
				}
				
			},
			remove:function(_Group,_Options,callback){	
				var GroupTabs = _Group.querySelector('.ohhai-group-children');
				var GroupParent = _Group.parentElement;

				//Does the group still have children?
				var GroupChildTabs = GroupTabs.children;
				if(GroupChildTabs.length != 0){
					for (index = 0; index < GroupChildTabs.length; ++index) {
						if(_Options.keepChildren){
							OhHaiBrowser.tabs.groups.removeTab(GroupChildTabs[index]);
						}else{
							OhHaiBrowser.tabs.remove(GroupChildTabs[index]);
						}
					}
				}

				GroupParent.removeChild(_Group);

				Groups.Remove(_Group.id,function(result){});
				
				if(typeof callback == "function"){
					callback(true);
				}		
			},
			addTab:function(_tab,_group,callback){
				if(_group == null){
					//New Group
					OhHaiBrowser.tabs.groups.add(null,null,_tab);
				}else{
					//Existing group
					var GroupChildren = _group.querySelector('.ohhai-group-children');
					GroupChildren.appendChild(_tab);
		
					var TabSessionId = _tab.getAttribute("data-session");
					Sessions.UpdateParent(TabSessionId,_group.id,function(id){console.log("AddToGroup - Parent updated:" + _group.id);});
					Sessions.UpdateMode(TabSessionId,"grouped",function(id){});

				}
				if(typeof callback =="function"){
					callback(true);
				}
			},
			removeTab:function(_tab,callback){
				var thisGroupList = _tab.parentElement;
				var thisGroup = thisGroupList.parentElement;

				OhHaiBrowser.ui.tabbar.tabcontainer.appendChild(_tab);		

				var TabSessionId = _tab.getAttribute("data-session");
				Sessions.UpdateParent(TabSessionId,OhHaiBrowser.ui.tabbar.tabcontainer.id,function(id){console.log("RemoveFromGroup - Parent updated:" + thisGroup.id);});
				Sessions.UpdateMode(TabSessionId,"default",function(id){});

				if(thisGroupList.children.length == 0){
					OhHaiBrowser.tabs.groups.remove(thisGroup)
				}
				if(typeof callback == "function"){
					callback(true);
				}
			}
		},
		activePage:{
			getURL: function(callback){
				OhHaiBrowser.tabs.getCurrent(function(cTab){
					var CurrentWebView = document.getElementById(cTab.getAttribute("data-container"));
					if(typeof callback == "function"){
						callback(CurrentWebView.getURL());
					}else{
						return CurrentWebView.getURL();
					}				
				});
			},
			getTitle: function(callback){
				OhHaiBrowser.tabs.getCurrent(function(cTab){
					var CurrentWebView = document.getElementById(cTab.getAttribute("data-container"));
					if(typeof callback == "function"){
						callback(CurrentWebView.getTitle());
					}else{
						return CurrentWebView.getTitle();
					}			
				});
			},
			goBack: function(callback){
				OhHaiBrowser.tabs.getCurrent(function(cTab){
					var CurrentWebView = document.getElementById(cTab.getAttribute("data-container"));
					CurrentWebView.goBack();
				});
				if(typeof callback == "function"){
					callback("request sent");	
				}			
			},
			goForward: function(callback){
				OhHaiBrowser.tabs.getCurrent(function(cTab){
					var CurrentWebView = document.getElementById(cTab.getAttribute("data-container"));
					CurrentWebView.goForward();
				});
				if(typeof callback == "function"){
					callback("request sent");	
				}			
			},
			reload: function(callback){
				OhHaiBrowser.tabs.getCurrent(function(cTab){
					var CurrentWebView = document.getElementById(cTab.getAttribute("data-container"));
					CurrentWebView.reload();
				});
				if(typeof callback == "function"){
					callback("request sent");	
				}		
			},
			navigate: function(url,callback){
				OhHaiBrowser.tabs.getCurrent(function(cTab){
					var CurrentWebView = document.getElementById(cTab.getAttribute("data-container"));
					CurrentWebView.loadURL(url);
				});
				if(typeof callback == "function"){
					callback("request sent");	
				}		
			},
			insertCSS:function(code,callback){
				OhHaiBrowser.tabs.getCurrent(function(cTab){
					var CurrentWebView = document.getElementById(cTab.getAttribute("data-container"));
					CurrentWebView.insertCSS(code);
				});
				if(typeof callback == "function"){
					callback("request sent");	
				}		
			},
			executeJavaScript:function(code,callback){
				OhHaiBrowser.tabs.getCurrent(function(cTab){
					var CurrentWebView = document.getElementById(cTab.getAttribute("data-container"));
					CurrentWebView.executeJavaScript(code);
				});
				if(typeof callback == "function"){
					callback("request sent");	
				}		
			},
			hasSibling: function(){
				var Sibling = null
				OhHaiBrowser.tabs.getCurrent(function(cTab){
					if(cTab.nextSibling){
						Sibling = {"sibling":cTab.nextSibling,"location":"next"};
					}else if(cTab.previousSibling){
						Sibling = {"sibling":cTab.previousSibling,"location":"last"};
					}
				});
				return Sibling;
			}
		},
		popupwindow: function(params,callback){
			//This is a pop up window - Does the user want this pop up, does it have a parent control? 
			const remote = require('electron').remote;
			const BrowserWindow = remote.BrowserWindow;
			var win = new BrowserWindow({ 
				width: 800, 
				height: 600,
				frame: false,
				icon: __dirname + '/window/assets/OhHaiIcon.ico',
				show: false
			});
			win.webContents.on('did-finish-load', ()=>{
				win.show();
				win.focus();
			 });
			win.loadURL("file://" + __dirname + '/system_assets/components/pop_out_window/template.html?url=' + params.url);

			callback(win);
		}
	},
	session: {
		list: function(callback){
			Sessions.Get(function(slist){
				if (typeof callback === "function") {
					callback(slist);
				}
			});
		}
	},
	bookmarks: {
		btn_bookmark:document.getElementById("BtnQuicklink"),
		add: function(bookmarkName,bookmarkUrl,bookmarkIcon,bookmarkDesc,popuplocal,callback){

			let BookmarkPopup = OhHaiBrowser.core.generateElement(`
			<div class='bookmark_popup' style='left:${(popuplocal.left - 249)};top:${(popuplocal.top + 23)};'>
				<p class='bookmark_title'>New bookmark</p>
				<input type='text' class='bookmark_nametxt' value='${bookmarkName}'>
				<input type='button' class='bookmark_add' value='Add'>
				<input type='button' class='bookmark_cancel' value='Cancel'>
			</div>`);

			var Txt_Url = BookmarkPopup.querySelector('.bookmark_nametxt');
			var Add_bookmark = BookmarkPopup.querySelector('.bookmark_add');
			var Cancel_bookmark = BookmarkPopup.querySelector('.bookmark_cancel');

			Add_bookmark.addEventListener("click", function(e) {
				Quicklinks.Add(bookmarkUrl,Txt_Url.value,bookmarkIcon,"",bookmarkDesc,function(newqlink){
					var ReturnVal = ((newqlink != 0||-1) ? newqlink : null);
					if(ReturnVal != null){
						OhHaiBrowser.bookmarks.btn_bookmark.setAttribute("data-id",newqlink);
						OhHaiBrowser.bookmarks.btn_bookmark.classList.remove("QuicklinkInactive");
						OhHaiBrowser.bookmarks.btn_bookmark.classList.add("QuicklinkActive");
					}else{
						//Error
					}
					BookmarkPopup.parentNode.removeChild(BookmarkPopup);
				});
			});

			Cancel_bookmark.addEventListener("click", function(e) {
				BookmarkPopup.parentNode.removeChild(BookmarkPopup);
			});

			document.body.appendChild(BookmarkPopup);

			callback("done");
		},
		remove: function(bookmarkId,callback){
			if (typeof callback === "function") {
				callback();
			}
		},
		check: function(url,callback){
			Quicklinks.IsBookmarked(url, function(item){
				var ReturnVal = "";
				if(item != undefined){
				  //This is a Qlink
				  ReturnVal = item.id;
				}else{
				  //Default state
				  ReturnVal = null;
				}
				if (typeof callback === "function") {
					callback(ReturnVal);
				}
			});
		},
		updateBtn: function(ReturnVal,callback){
			if(ReturnVal != null){
				OhHaiBrowser.bookmarks.btn_bookmark.setAttribute("data-id",ReturnVal);

				OhHaiBrowser.bookmarks.btn_bookmark.classList.remove("QuicklinkInactive");
				OhHaiBrowser.bookmarks.btn_bookmark.classList.add("QuicklinkActive");
			}else{
				//Default state
				OhHaiBrowser.bookmarks.btn_bookmark.classList.remove("QuicklinkActive");
				OhHaiBrowser.bookmarks.btn_bookmark.classList.add("QuicklinkInactive");
				
				OhHaiBrowser.bookmarks.btn_bookmark.setAttribute("data-id","");
			}
			if (typeof callback === "function") {
				callback("complete");
			}
		}
	},
	history: {
		list: function(callback){
			var HistList;
			History.List(function(arraylist){
				if (typeof callback === "function") {
					callback(arraylist);
				}
			});
		}
	},
	settings: {		
		homepage: function(){
			Settings.Get("homepage",function(homeitem){
				if(homeitem != undefined){
					return homeitem.value;
				}else{
					return "default";
				}
			});
		},
		search: function(){
			Settings.Get("search",function(item){
				if(item != undefined){
					return item.value;
				}else{
					return "https://www.google.co.uk/search?q=";
				}
			});
		},
		generic: function(settingName, callback){
			Settings.Get(settingName,function(item){
				if(item != undefined){
					callback(item.value);
				}else{
					callback(null);
				}
			});
		}
	},
	ui: {
		floatingVidPlayer: function(url,callback){
			var callbackval = "";
			OhHaiBrowser.validate.url(url,function(isurl){
				if(isurl == true){
					OhHaiBrowser.tabs.activePage.executeJavaScript("document.getElementsByTagName('video')[0].pause();");

					$("#VideoPlayer").show();
					$("#VidInner").animate({ width: 'show' }, 150);
					$('#VidFrame').attr('src', url);
					
					callbackval = "Done";
				}else{
					//not a valid URL
					callbackval = "Invalid URL string"
				}
				if (typeof callback === "function") {
					callback(callbackval);
				}
			});	
		},
		videoPlayer:function(params,callback){
			//This is a pop up window - Does the user want this pop up, does it have a parent control? 
			const remote = require('electron').remote;
			var ThisWindow = remote.getCurrentWindow();
			const BrowserWindow = remote.BrowserWindow;
			var win = new BrowserWindow({ 
				width: 534, 
				height: 300,
				frame: false,
				minimizable:false,
				maximizable:false,
				fullscreenable:false,
				alwaysOnTop:true,
				icon: __dirname + '/window/assets/OhHaiIcon.ico',
				show: false
			});
			win.webContents.on('did-finish-load', ()=>{
				win.show();
				win.focus();
			});
			win.loadURL("file://" + __dirname + '/system_assets/components/pop_out_player/template.html?url=' + params.url);
			win.webContents.openDevTools();
			if (typeof callback === "function") {
				callback(win);
			}			
		},
		closeFloatingVidPlayer: function(){
			$("#VideoPlayer").fadeOut();
			$('#VidFrame').attr('src', '')
		},
		notifications: {
			post: function(notificationText, callback){
				if (typeof callback === "function") {
					callback();
				}
			},
			remove: function(notificationId, callback){
				if (typeof callback === "function") {
					callback();
				}
			}
		},
		theme: {
			load: function(stylesheet,callback){
				var ThemeCss = document.getElementById('ThemeStyle');
				if (ThemeCss != null){
					ThemeCss.setAttribute("href",stylesheet);
					if (typeof callback === "function") {
						callback(true);
					}
				}
			}
		},
		contextmenus: {
			urlbar: function(URLBar){
				var URlMenu = new Menu()
				URlMenu.append(new MenuItem({label: 'Copy title', click() { OhHaiBrowser.tabs.activePage.getTitle(function(pagetitle){clipboard.writeText(pagetitle);});}}))	
				URlMenu.append(new MenuItem({label: 'Copy URL', click() { OhHaiBrowser.tabs.activePage.getURL(function(pageurl){clipboard.writeText(pageurl);}); }}))	
				URlMenu.append(new MenuItem({label: 'Paste', click() { OhHaiBrowser.ui.navbar.txt_urlBar.value = clipboard.readText(); }}))
				return URlMenu;
			},
			webview: function(ThisWebview,webviewcontent,params){
				var Web_menu = new Menu()
				if(params.linkURL != ""){
					Web_menu.append(new MenuItem({label: 'Open link in new tab', click() {OhHaiBrowser.tabs.add(params.linkURL,undefined,{selected: true});}}))		
					Web_menu.append(new MenuItem({type: 'separator'}))	
				}

				if(params.srcURL != ""){
					Web_menu.append(new MenuItem({label: 'Open ' + params.mediaType  +' in new tab', click() {OhHaiBrowser.tabs.add(params.srcURL,undefined,{selected: true});}}))		
					Web_menu.append(new MenuItem({type: 'separator'}))	
				}

				if(params.selectionText != "" || params.inputFieldType != "none"){
					Web_menu.append(new MenuItem({label: 'Copy', click() { clipboard.writeText(params.selectionText); },enabled: params.editFlags.canCopy }))	
					Web_menu.append(new MenuItem({label: 'Paste', click() { webviewcontent.paste(); },enabled: params.editFlags.canPaste }))	
					Web_menu.append(new MenuItem({type: 'separator'}))
					Web_menu.append(new MenuItem({label: 'Google search for selection', click() {OhHaiBrowser.tabs.add("https://www.google.co.uk/search?q=" + params.selectionText,undefined,{selected: true});} }))	
				}

				switch(params.mediaType){
					case("image"):
						Web_menu.append(new MenuItem({label: 'Copy image', click() { webviewcontent.copyImageAt(params.x, params.y); } }))
					break;
				}

				Web_menu.append(new MenuItem({label: 'Select all', accelerator: 'CmdOrCtrl+A', click() { webviewcontent.selectAll(); }}))
				Web_menu.append(new MenuItem({type: 'separator'}))

				Web_menu.append(new MenuItem({
					label: 'Back', 
					accelerator: 'Alt+Left', 
					click() { 
						OhHaiBrowser.tabs.activePage.goBack(); 
					}
				}))
				Web_menu.append(new MenuItem({
					label: 'Refresh',
					accelerator: 'CmdOrCtrl+R', 
					click() { 
						OhHaiBrowser.tabs.activePage.reload(); 
					}
				}))
				Web_menu.append(new MenuItem({label: 'Forward', accelerator: 'Alt+Right', click() { OhHaiBrowser.tabs.activePage.goForward(); }}))
				Web_menu.append(new MenuItem({type: 'separator'}))
				Web_menu.append(new MenuItem({label: 'Inspect', accelerator: 'CmdOrCtrl+Shift+I' , click() { webviewcontent.inspectElement(params.x, params.y); }}))
				
				return Web_menu
			},
			tab: function(ThisTab,ThisWebview,TabLbl,TabEx){

				var NewMenu = new Menu()
				NewMenu.append(new MenuItem({label: 'New Tab', click() {OhHaiBrowser.tabs.add(OhHaiBrowser.settings.homepage(),undefined,{selected: true});}}))
				NewMenu.append(new MenuItem({label: 'New Incognito Tab', click() { OhHaiBrowser.tabs.add(OhHaiBrowser.settings.homepage(),undefined,{selected: true,mode:"incog"}); }}))
				NewMenu.append(new MenuItem({type: 'separator'}))
				if(ThisTab.parentElement.classList.contains("ohhai-group-children")){
					//This tabs is in a group
					NewMenu.append(new MenuItem({label: 'Remove tab from group', click() { OhHaiBrowser.tabs.groups.removeTab(ThisTab);}}))
				}else{
					//This is a standard tab
					var GroupMenu = [new MenuItem({label: 'New group', click() { OhHaiBrowser.tabs.groups.addTab(ThisTab,null);}})];
					var CurrentGroups = document.getElementsByClassName("group");
					if(CurrentGroups.length > 0){
						GroupMenu.push(new MenuItem({type: 'separator'}));
						for (var i = 0; i < CurrentGroups.length; i++) {
							var ThisGroup = CurrentGroups[i];
							var GroupTitle = ThisGroup.querySelector('.ohhai-group-txt').value;
							GroupMenu.push(new MenuItem({label: GroupTitle, click() {  OhHaiBrowser.tabs.groups.addTab(ThisTab,ThisGroup);}}));
						}
					}
			
					NewMenu.append(new MenuItem({label: 'Add tab to group', type:'submenu' ,submenu:GroupMenu}))
				}
				if(ThisWebview.isAudioMuted() == true){
					NewMenu.append(new MenuItem({label: 'Unmute Tab', click() {
						 ThisWebview.setAudioMuted(false); 
					}}))
				}else{
					NewMenu.append(new MenuItem({label: 'Mute Tab', click() {
						ThisWebview.setAudioMuted(true); 
					}}))
				}
				OhHaiBrowser.tabs.ismode(ThisTab,"docked",function(returnval){
					if(returnval == true){
						NewMenu.append(new MenuItem({label: 'Undock Tab', click() { OhHaiBrowser.tabs.setMode(ThisTab,"default",function(){});}}))
					}else{
						NewMenu.append(new MenuItem({label: 'Dock Tab', click() { OhHaiBrowser.tabs.setMode(ThisTab,"docked",function(){});}}))
					}
				});
				NewMenu.append(new MenuItem({type: 'separator'}))
				NewMenu.append(new MenuItem({label: 'Close Tab', click() { OhHaiBrowser.tabs.remove(ThisTab); }}))
			
				return NewMenu;
				
			},
			tabmenu: function(){
				var NewMenu = new Menu()
				NewMenu.append(new MenuItem({label: 'New Tab', click() {OhHaiBrowser.tabs.add(OhHaiBrowser.settings.homepage(),undefined,{selected: true});}}))
				NewMenu.append(new MenuItem({label: 'New Incognito Tab', click() { OhHaiBrowser.tabs.add(OhHaiBrowser.settings.homepage(),undefined,{selected: true,mode:"incog"}); }}));
				NewMenu.append(new MenuItem({label: 'New Group', click() {OhHaiBrowser.tabs.groups.add(null,null,null); }}));
			
				return NewMenu;
			},
			quicklink: function(Id,Name,Url,Item){
				var NewMenu = new Menu()
				NewMenu.append(new MenuItem({label: 'Open', click() { OhHaiBrowser.tabs.activePage.navigate(Url);}}))
				NewMenu.append(new MenuItem({label: 'Open in new tab', click() { OhHaiBrowser.tabs.add(Url,undefined,{selected: true}); }}))
				NewMenu.append(new MenuItem({type: 'separator'}))
				NewMenu.append(new MenuItem({label: 'Delete', click() {
					Quicklinks.Remove(Id, function(recordsdeleted){
						if(recordsdeleted != 0 || undefined){
							Item.parentNode.removeChild(Item);
						}else{
							//Error?
						}
					});
				 }}))
				return NewMenu;
			},
			group: function(Group,GroupChildren){
				var GroupMenu = new Menu()
				GroupMenu.append(new MenuItem({label: 'Add tab to group', click() {OhHaiBrowser.tabs.add(OhHaiBrowser.settings.homepage(),undefined,{selected: true,mode:"grouped",parent:GroupChildren}); }}))
				GroupMenu.append(new MenuItem({type: 'separator'}))
				GroupMenu.append(new MenuItem({label: 'Remove group, keep tabs', click() { OhHaiBrowser.tabs.groups.remove(Group,{keepChildren:true});}}))
				GroupMenu.append(new MenuItem({label: 'Remove group and tabs', click() { OhHaiBrowser.tabs.groups.remove(Group,{keepChildren:false});}}))

				return GroupMenu;
			}
		},
		overflowmenu: {
			panel: document.getElementById("OverFlowMenu"),
			items: {
				overflowOptionsMenu: document.getElementById('OverFlowOptions'),
				overflowDeepMenu: document.getElementById('OverFlowDeepMenu'),
				overflowDeepMenuTitle: document.getElementById('MenuTitle')
			},
			opened:false,
			toggle:function(){
				if(OhHaiBrowser.ui.overflowmenu.opened == true){
					OhHaiBrowser.ui.overflowmenu.panel.classList.add("OverflowHidden");
					OhHaiBrowser.ui.overflowmenu.panel.classList.remove("OverflowShow");
					OhHaiBrowser.ui.overflowmenu.opened = false;
				}else{
					OhHaiBrowser.ui.overflowmenu.panel.classList.add("OverflowShow");
					OhHaiBrowser.ui.overflowmenu.panel.classList.remove("OverflowHidden");
					OhHaiBrowser.ui.overflowmenu.opened = true;
				}

				event.stopPropagation();
			},
			setvis:function(toggle){
				if(toggle == true){
					OhHaiBrowser.ui.overflowmenu.panel.classList.add("OverflowShow");
					OhHaiBrowser.ui.overflowmenu.panel.classList.remove("OverflowHidden");
					OhHaiBrowser.ui.overflowmenu.opened = true;
				}else{
					OhHaiBrowser.ui.overflowmenu.panel.classList.add("OverflowHidden");
					OhHaiBrowser.ui.overflowmenu.panel.classList.remove("OverflowShow");
					OhHaiBrowser.ui.overflowmenu.opened = false;
				}
			}
		},
		navbar:{
			txt_urlBar: document.getElementById("URLBar"),
			btn_pageInfo: document.getElementById("SecureCheck"),
			btn_bookmark: document.getElementById("BtnQuicklink"),
			updateTabCounter: function(){
				document.getElementById("HideShowCount").textContent = OhHaiBrowser.tabs.count;
			},
			updateURLBar:function(webview,callback){
    			if (!OhHaiBrowser.validate.internalpage(decodeURI(webview.getURL()))){	
					OhHaiBrowser.ui.navbar.updatePageInfo(webview);
					OhHaiBrowser.ui.navbar.txt_urlBar.value = webview.getTitle(); 
					OhHaiBrowser.ui.navbar.txt_urlBar.setAttribute("data-text-swap",webview.getURL());
					OhHaiBrowser.ui.navbar.txt_urlBar.setAttribute("data-text-original",webview.getTitle());
    			}else{
					OhHaiBrowser.ui.navbar.btn_pageInfo.classList.remove("Http","Https","CirtError","Loading");
					OhHaiBrowser.ui.navbar.btn_pageInfo.classList.add("Internal");
					OhHaiBrowser.ui.navbar.txt_urlBar.value = ""; 
					OhHaiBrowser.ui.navbar.txt_urlBar.setAttribute("data-text-swap","");
					OhHaiBrowser.ui.navbar.txt_urlBar.setAttribute("data-text-original","");
   	 			}
				if(typeof callback == "function"){callback(true);}
			},
			updatePageInfo:function(webview){
				var webviewcontent = webview.getWebContents();	
				var CurrentURL = decodeURI(webview.getURL());

				OhHaiBrowser.ui.navbar.btn_pageInfo.classList.remove("Http","Https","CirtError","Loading","Internal");
				switch(true){
					case CurrentURL.includes("http://"):
					OhHaiBrowser.ui.navbar.btn_pageInfo.classList.add("Http");
					break;
					case CurrentURL.includes("https://"):
					OhHaiBrowser.ui.navbar.btn_pageInfo.classList.add("Https");
					break;
				}

				webviewcontent.on("certificate-error", (e, url,error,cert) => {
					OhHaiBrowser.ui.navbar.btn_pageInfo.classList.add("CirtError");
				});
			}
		},
		tabbar:	{
			panel: document.getElementById("LeftMenu"),
			tabcontainer: document.getElementById("tabs-menu"),
			pinnedtabcontainer: document.getElementById("tabs-dock"),
			webviewcontainer: document.getElementById("BrowserWin"),
			pined: true,
			toggle: function(){
				if(OhHaiBrowser.ui.tabbar.pined == true){
					OhHaiBrowser.ui.tabbar.panel.classList.add("LeftMenuHidden");
					OhHaiBrowser.ui.tabbar.panel.classList.remove("LeftMenuShow");
					OhHaiBrowser.ui.tabbar.pined = false;
					Settings.Set("TabBar",false, function(){});
				}else{
					OhHaiBrowser.ui.tabbar.panel.classList.add("LeftMenuShow");
					OhHaiBrowser.ui.tabbar.panel.classList.remove("LeftMenuHidden");
					OhHaiBrowser.ui.tabbar.pined = true;
					Settings.Set("TabBar",true, function(){});	
				}
			}
		},
		wcm:{
			template:"<div class='WMC_popup'><span class='WCM_msg'></span><input type='button' class='WCM_close' value='X'/></div>",
			post:function(msg,onclick_func,callback){
        var this_WCM = OhHaiBrowser.core.generateElement(this.template);

        this_WCM.querySelector(".WCM_msg").textContent = msg;
        this_WCM.querySelector(".WCM_close").addEventListener("click",function(){
				this_WCM.classList.remove("WMC_Show");                       
          setTimeout(function(){this_WCM.remove();},800);
				});
        this_WCM.querySelector(".WCM_msg").addEventListener("click",function(){
					this_WCM.classList.remove("WMC_Show");                       
        	setTimeout(function(){this_WCM.remove();},800);
					onclick_func();
				});

				document.body.appendChild(this_WCM)
				setTimeout(function(){this_WCM.classList.add("WMC_Show");},10);   

				//auto close after 5 seconds
				setTimeout(function(){
					this_WCM.classList.remove("WMC_Show");                       
          setTimeout(function(){this_WCM.remove();},800);
				},5000);

			}
		}
	},
	toggleLock:function(){
		if(OhHaiBrowser.isLocked){
			
		}else{

		}
	},
	isLocked: false,
	about: {
		onlineStatus: function(callback){
			if (typeof callback === "function") {
				callback();
			}
		},
		version: {
			full: function(callback){
				if (typeof callback === "function") {
					callback();
				}
			},
			platform: function(callback){
				if (typeof callback === "function") {
					callback();
				}
			},
			major: function(callback){
				if (typeof callback === "function") {
					callback();
				}
			},
			minor: function(callback){
				if (typeof callback === "function") {
					callback();
				}
			},
			build: function(callback){
				if (typeof callback === "function") {
					callback();
				}
			}
		}
	},
	validate: {
		url: function(testvalue, callback){
			var myRegExp =/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
			var returnbol = false;
			if(!myRegExp.test(testvalue)){returnbol = false;}
			else{returnbol = true;}
			if (typeof callback === "function") {
				callback(returnbol);
			}	
		},
		string: function(input){
			return typeof input === 'string' || input instanceof String;
		},
		number: function(input){
			return typeof input === 'number' && isFinite(input);
		},
		hostname: function(url){
			var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
		    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
    			return match[2];
   			}
    		else {
        		return null;
    		}
		},
		internalpage: function(input){
			var RunDir = decodeURI("file://" + __dirname).replace(/\\/g, "/");
			return isInternalPage = input.indexOf(RunDir) !== -1
		}
	},
	core: require(`./system_assets/modules/OhHaiBrowser.Core.js`)
}


OhHaiBrowser.sessionStartTime = Date.now();

//Functions for tab reordering
new Slip(OhHaiBrowser.ui.tabbar.tabcontainer);

OhHaiBrowser.ui.tabbar.tabcontainer.addEventListener('slip:beforeswipe', function(e){
	e.preventDefault();
}, false);

OhHaiBrowser.ui.tabbar.tabcontainer.addEventListener('slip:reorder', function(e){
    e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
    return false;
}, false);
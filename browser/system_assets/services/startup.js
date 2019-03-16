OhHaiBrowser.sessionStartTime = Date.now();

let launchparams = remote.getGlobal('sharedObject').prop1,
	IsLaunchParam = function () {
		if (launchparams.length == 1) {
			return false;
		} else {
			return true;
		}
	};

Settings.Get('FirstRun', function (i) {
	if (i == undefined) {
		//this is a new user! - Show them the setup page
		Settings.Set('FirstRun', Date.now(), function (c) {});
	}
});

//var arguments = launchparams.split(",");
Settings.Get('Launch', function (item) {
	if (item != undefined) {
		switch (item.value) {
		case 'fresh':
			//Fresh session
			if (!IsLaunchParam) {
				OhHaiBrowser.tabs.add(OhHaiBrowser.settings.homepage, undefined, {
					selected: true
				});
			}
			break;
		default:
			//Old session
			Groups.Get(function (Glist) {
				if (Glist.length != 0) {
					for (g in Glist) {
						OhHaiBrowser.tabs.groups.add(Glist[g].groupid, Glist[g].name, 'session');
					}
				}
				Sessions.Get(function (Slist) {
					if (Slist.length != 0) {
						for (s in Slist) {
							OhHaiBrowser.tabs.add(Slist[s].url, Slist[s].sessionid, {
								selected: true,
								mode: Slist[s].mode,
								parent: Slist[s].parent,
								title: Slist[s].title
							});
						}
					} else {
						//No session
						if (!IsLaunchParam) {
							OhHaiBrowser.tabs.add(OhHaiBrowser.settings.homepage, undefined, {
								selected: true
							});
						}
					}
				});
			});
		}
	} else {
		Groups.Get(function (Glist) {
			if (Glist.length != 0) {
				for (g in Glist) {
					OhHaiBrowser.tabs.groups.add(Glist[g].groupid, Glist[g].name, 'session');
				}
			}
			Sessions.Get(function (Slist) {
				if (Slist.length != 0) {
					for (s in Slist) {
						OhHaiBrowser.tabs.add(Slist[s].url, Slist[s].sessionid, {
							selected: true,
							mode: Slist[s].mode,
							parent: Slist[s].parent,
							title: Slist[s].title
						});
					}
				} else {
					OhHaiBrowser.tabs.add('default', undefined, {
						selected: true
					});
				}
			});
		});
	}
});
if (IsLaunchParam) {
	launchparams.forEach(param => {
		console.log('param' + param);
		OhHaiBrowser.validate.url(param, function (valresult) {
			if (valresult == true) {
				OhHaiBrowser.tabs.add(param, undefined, {
					selected: true
				});
			}
		});
	});
}

OhHaiBrowser.bookmarks.load();
OhHaiBrowser.history.load();

Settings.Get('TabBar', function (item) {
	if (item != undefined) {
		if (item.value == false) {
			OhHaiBrowser.ui.tabbar.panel.classList.add('LeftMenuHidden');
			OhHaiBrowser.ui.tabbar.panel.classList.remove('LeftMenuShow');
			OhHaiBrowser.ui.tabbar.pined = false;
		} else {
			OhHaiBrowser.ui.tabbar.pined = true;
		}
	}
});

Settings.Get('Homepage', (homeitem) => {
	if (homeitem != undefined) {
		OhHaiBrowser.settings.homepage = homeitem.value;
	} else {
		OhHaiBrowser.settings.homepage = 'default';
	}
});

Settings.Get('search', (settingItem) => {
	if (settingItem !== undefined) {
		OhHaiBrowser.settings.search = settingItem.value;
	} else {
		OhHaiBrowser.settings.search = 'https://www.google.co.uk/search?q=';
	}
});
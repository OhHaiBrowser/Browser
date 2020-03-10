const {remote} = require('electron');
const {Groups, Settings, Sessions} = require('../system_assets/modules/OhHaiBrowser.Data');

module.exports.startup = () => {
	OhHaiBrowser.sessionStartTime = Date.now();
	
	const launchparams = remote.getGlobal('sharedObject').prop1;
	let IsLaunchParam = () => {
		return launchparams.length == 1 ? false : true;
	};
	Settings.Get('FirstRun').catch(() => {
		Settings.Set('FirstRun', Date.now());
	});
    
	Settings.Get('Launch').then((item) => {
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
			LoadPreviousSession(IsLaunchParam);
		}
	}).catch(() => {
		LoadPreviousSession(IsLaunchParam);
	});

	if (IsLaunchParam) {
		LoadParam(launchparams);
	}
    
	Settings.Get('TabBar').then((item) => {
		if (item.value == false) {
			OhHaiBrowser.ui.tabbar.panel().classList.add('LeftMenuHidden');
			OhHaiBrowser.ui.tabbar.panel().classList.remove('LeftMenuShow');
			OhHaiBrowser.ui.tabbar.pined = false;
		} else {
			OhHaiBrowser.ui.tabbar.pined = true;
		}
	});
    
	Settings.Get('Homepage').then((homeitem) => {
		OhHaiBrowser.settings.homepage = homeitem.value;
	}).catch(() => {
		OhHaiBrowser.settings.homepage = 'default';
	});
    
	Settings.Get('search').then((settingItem) => {
		OhHaiBrowser.settings.search = settingItem.value;
	}).catch(() => {
		OhHaiBrowser.settings.search = 'https://www.google.co.uk/search?q=';
	});
    
};

function LoadPreviousSession(IsLaunchParam){
	Groups.Get().then((Glist) => {
		if (Glist.length != 0) {
			for (g in Glist) {
				OhHaiBrowser.tabs.groups.add(Glist[g].groupid, Glist[g].name, 'session');
			}
		}
		Sessions.Get().then((Slist) => {
			if (Slist.length != 0) {
				Slist.forEach((s) => {
					OhHaiBrowser.tabs.add(s.url, s.sessionid, {
						selected: true,
						mode: s.mode,
						parent: s.parent,
						title: s.title
					});
				});
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

function LoadParam(launchparams){
	launchparams.forEach(param => {
		OhHaiBrowser.validate.url(param, function (valresult) {
			if (valresult == true) {
				OhHaiBrowser.tabs.add(param, undefined, {
					selected: true
				});
			}
		});
	});	
}
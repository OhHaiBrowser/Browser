const {remote} = require('electron');
const {Groups, Settings, Sessions} = require('../system_assets/modules/OhHaiBrowser.Data');
const {tabs} = require('./tabs.service');
const {tabbar} = require('./tabbar.service');

module.exports.runStartup = () => {
	window.OhHaiBrowser.sessionStartTime = Date.now();
	
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
				tabs.add(window.OhHaiBrowser.settings.homepage, undefined, {
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
			tabbar.panel().classList.add('LeftMenuHidden');
			tabbar.panel().classList.remove('LeftMenuShow');
			tabbar.pined = false;
		} else {
			tabbar.pined = true;
		}
	});
    
	Settings.Get('Homepage').then((homeitem) => {
		window.OhHaiBrowser.settings.homepage = homeitem.value;
	}).catch(() => {
		window.OhHaiBrowser.settings.homepage = 'default';
	});
    
	Settings.Get('search').then((settingItem) => {
		window.OhHaiBrowser.settings.search = settingItem.value;
	}).catch(() => {
		window.OhHaiBrowser.settings.search = 'https://www.google.co.uk/search?q=';
	});
    
};

function LoadPreviousSession(IsLaunchParam){
	Groups.Get().then((Glist) => {
		if (Glist.length != 0) {
			for (let g in Glist) {
				tabs.groups.add(Glist[g].groupid, Glist[g].name, 'session');
			}
		}
		Sessions.Get().then((Slist) => {
			if (Slist.length != 0) {
				Slist.forEach((s) => {
					tabs.add(s.url, s.sessionid, {
						selected: true,
						mode: s.mode,
						parent: s.parent,
						title: s.title
					});
				});
			} else {
				//No session
				if (!IsLaunchParam) {
					tabs.add(window.OhHaiBrowser.settings.homepage, undefined, {
						selected: true
					});
				}
			}
		});
	});
}

function LoadParam(launchparams){
	launchparams.forEach(param => {
		window.OhHaiBrowser.validate.url(param, function (valresult) {
			if (valresult == true) {
				tabs.add(param, undefined, {
					selected: true
				});
			}
		});
	});	
}
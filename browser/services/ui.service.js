const { remote } = require('electron');
const thisWindow = remote.getCurrentWindow();
const {controls} = require('./navbar.service');
const {tabbar} = require('./tabbar.service');
const {tabs} = require('./tabs.service');
const { Quicklinks } = require('../system_assets/modules/OhHaiBrowser.Data');
const Contextuals = require('../system_assets/modules/Contextuals/Contextuals');
const AboutMenu = require('../components/about/about');
const SettingsMenu = require('../components/settings/settings');

module.exports.initUi = () => {
	createFrameControls();
	createNavEvents();
};

function createFrameControls(){
	const frameControl = document.getElementById('frameControls');
	frameControl.windowMaximised = thisWindow.isMaximized();
	frameControl.addEventListener('minimise', () => {
		thisWindow.minimize();
	});
	frameControl.addEventListener('restore', () => {
		thisWindow.restore();
	});
	frameControl.addEventListener('maximise', () => {
		thisWindow.maximize();
	});
	frameControl.addEventListener('close', () => {
		thisWindow.close();
	});
}

function createNavEvents() {
	controls.btn_ToggleTabBar().addEventListener('click', tabbar.toggle );
	controls.btn_back().addEventListener('click', tabs.activePage.goBack );
	controls.btn_forward().addEventListener('click', tabs.activePage.goForward );	
	controls.txt_urlbar().addEventListener('refresh', tabs.activePage.reload);

	controls.txt_urlbar().addEventListener('enter', function (event) {
		tabs.activePage.navigate(event.detail);
	});	
	//--------------------------------------------------------------------------------------------------------------
	//URL bar functions
	//-----------------------------------------------------------------------------------------------------
	controls.txt_urlbar().addEventListener('favorited', (e) => {
		const favBar = document.getElementById('FavoritesList');

		if(e.detail) {
			//Add new bookmark
			const cSession = tabs.getCurrent();
			favBar.add(cSession.webview.getURL(), cSession.webview.getTitle(), '');
		} else {
			//Remove bookmark	
			var ThisId = Number(controls.txt_urlbar().bookmarkId);
			Quicklinks.Remove(ThisId).then(() => {
				controls.txt_urlbar().bookmarkId = null;
			});
		}
	});
	//Right Controls
	//-------------------------------------------------------------------------------------------------------------------------
	controls.btn_overflow().addEventListener('click',() => {
		new Contextuals.menu([
			{title:'New tab', tip:'', icon:'assets/imgs/transparent.png', onclick:() => {
				tabs.add(window.OhHaiBrowser.settings.homepage,undefined,{selected: true});
			}},
			{title:'New incognito tab', tip:'', icon:'assets/imgs/transparent.png', onclick:() => {
				tabs.add(window.OhHaiBrowser.settings.homepage,undefined,{selected: true,mode:'incog'});
			}},
			{seperator:true},
			{title:'Settings', tip:'', icon:'assets/imgs/transparent.png', onclick:() => {
				window.OhHaiBrowser.ui.toggleModel(SettingsMenu(),'Settings');
			}},
			{title:'About', tip:'', icon:'assets/imgs/transparent.png', onclick:() => {
				window.OhHaiBrowser.ui.toggleModel(AboutMenu(),'OhHai Browser');
			}}
		]);
	});
	tabbar.panel().addEventListener('contextmenu', (e) => {
		switch (e.target.className) {
		case 'CommandBtn AddTab':
		case 'OhHai-TabMenu':
			//Everythig which isnt a tab
			var TbMen = tabbar.contextMenu();
			e.preventDefault();
			TbMen.popup(remote.getCurrentWindow());
			break;
		}
	}, false);
	tabbar.addTabBtn().addEventListener('click', () => {
		tabs.add(window.OhHaiBrowser.settings.homepage, undefined, {
			selected: true
		});
	});
}

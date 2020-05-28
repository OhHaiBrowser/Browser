// Load custom components
require('./components/index');

const {ipcRenderer} = require('electron');
const { initUi } = require('../services/ui.service');
const { runStartup } = require('../services/startup.service');
const { definePublicAPIs } = require('../services/public.api.service');
const feather = require('feather-icons');

definePublicAPIs();
initUi();
runStartup();
feather.replace();

const sideBar = document.getElementById('Sid');
const urlBar = document.getElementById('URLBar');
ipcRenderer.on('shortcut-key', (event, args) => {
	switch(args) {
	case 'tab-new': 
		break;
	case 'tab-new-incog': 
		break;
	case 'tab-close': 
		break;
	case 'window-close': 
		break;
	case 'navbar-select':
		urlBar.select();
		break;
	case 'web-refresh': 
		break;
	case 'web-refresh-hard':
		break;
	case 'web-back':
		break;
	case 'web-forward':
		break;
	case 'history-show':
		sideBar.showPanel(sideBar.panels().item(2));
		break;
	case 'bookmarks-show':
		sideBar.showPanel(sideBar.panels().item(1));
		break;
	case 'bookmarks-new':
		break;
	case 'web-view-source':
		break;
	case 'web-inspect':
		break;
	case 'tab-select-next':
		break;
	case 'tab-select-previous':
		break;
	}
});
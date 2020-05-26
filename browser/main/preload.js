const { urlbar } = require('../components/url-bar/urlbar.component');
const favoritesList = require('../components/fav-list/bookmarks');
const histList = require('../components/hist-list/history');

const { initUi } = require('../services/ui.service');
const { runStartup } = require('../services/startup.service');
const { definePublicAPIs } = require('../services/public.api.service');
const feather = require('feather-icons');

//Define custom controls

customElements.define('fav-list', favoritesList);
customElements.define('hist-list', histList);
customElements.define('url-bar', urlbar);

definePublicAPIs();

//Load core ui functions
document.addEventListener('DOMContentLoaded', function(){
	initUi();
	runStartup();
	feather.replace();
});

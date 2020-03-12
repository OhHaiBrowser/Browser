const { accordionPanel, accordionItem } = require('./components/accordion/accordion.component');
const { tabItem } = require('./components/tab/tab.component');
const { frameControls } = require('./components/frame-controls/frame.controls');
const { urlbar } = require('./components/url-bar/urlbar.component');
const favoritesList = require('./components/fav-list/bookmarks');
const histList = require('./components/hist-list/history');
const { initUi } = require('./services/ui.service');
const { runStartup } = require('./services/startup.service');
const { definePublicAPIs } = require('./services/public.api.service');

//Define custom controls
customElements.define('acc-panel', accordionPanel);
customElements.define('acc-item', accordionItem);
customElements.define('tab-item', tabItem);
customElements.define('frame-controls', frameControls);
customElements.define('fav-list', favoritesList);
customElements.define('hist-list', histList);
customElements.define('url-bar', urlbar);

//Load core ui functions
document.addEventListener('DOMContentLoaded', function(){
	//definePublicAPIs();
	initUi();
	runStartup();
});

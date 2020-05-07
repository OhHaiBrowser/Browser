const { accordionPanel, accordionItem } = require('./components/accordion/accordion.component');
const { frameControls } = require('./components/frame-controls/frame.controls');
const { urlbar } = require('./components/url-bar/urlbar.component');
const favoritesList = require('./components/fav-list/bookmarks');
const histList = require('./components/hist-list/history');
const {ModelPopup} = require('./components/model-popup/model.component');
const { initUi } = require('./services/ui.service');
const { runStartup } = require('./services/startup.service');
const { definePublicAPIs } = require('./services/public.api.service');
const feather = require('feather-icons');

//Define custom controls
customElements.define('acc-panel', accordionPanel);
customElements.define('acc-item', accordionItem);
customElements.define('frame-controls', frameControls);
customElements.define('fav-list', favoritesList);
customElements.define('hist-list', histList);
customElements.define('url-bar', urlbar);
customElements.define('model-popup', ModelPopup);
definePublicAPIs();

//Load core ui functions
document.addEventListener('DOMContentLoaded', function(){
	initUi();
	runStartup();
	feather.replace();
});

const {accordionPanel, accordionItem} = require('./accordion/accordion.component');
const {ModelPopup} = require('./model-popup/model.component');
const { frameControls } = require('./frame-controls/frame.controls');
const {tabItem} = require('./tab/tab.component');
const {urlbar} = require('./url-bar/urlbar.component');
const {histList} = require('./hist-list/history');
const {favoritesList} = require('./fav-list/bookmarks');

customElements.define('acc-panel', accordionPanel);
customElements.define('acc-item', accordionItem);
customElements.define('model-popup', ModelPopup);
customElements.define('frame-controls', frameControls);
customElements.define('tab-item', tabItem);
customElements.define('url-bar', urlbar);
customElements.define('hist-list', histList);
customElements.define('fav-list', favoritesList);
const {accordionPanel, accordionItem} = require('./accordion/accordion.component');
const {ModelPopup} = require('./model-popup/model.component');
const { frameControls } = require('./frame-controls/frame.controls');
const {tabItem} = require('./tab/tab.component');

customElements.define('acc-panel', accordionPanel);
customElements.define('acc-item', accordionItem);
customElements.define('model-popup', ModelPopup);
customElements.define('frame-controls', frameControls);
customElements.define('tab-item', tabItem);

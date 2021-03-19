import {TimelineSection} from './timeline-section.js';
import {WebControls} from './web-controls.js'
import {FrameControls} from './frame-controls.js'
import {BookmarksList} from './bookmarks-list.js'
import {HistoryItem, HistoryList} from './history-list.js'
import {Tab} from './tab-element.js'

customElements.define('timeline-section', TimelineSection);
customElements.define('web-controls', WebControls);
customElements.define('frame-controls', FrameControls);
customElements.define('bookmarks-list',BookmarksList);
customElements.define('history-item', HistoryItem);
customElements.define('history-list', HistoryList);
customElements.define('tab-element', Tab);
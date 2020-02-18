const { remote } = require('electron');
const { accordionPanel, accordionItem } = require('./components/accordion/accordion.component');
const { tabItem } = require('./components/tab/tab.component');
const { frameControls } = require('./components/frame.controls');
const thisWindow = remote.getCurrentWindow();

//Define custom controls
customElements.define('acc-panel', accordionPanel);
customElements.define('acc-item', accordionItem);
customElements.define('tab-item', tabItem);
customElements.define('frame-controls', frameControls);

document.addEventListener('DOMContentLoaded', function(){
	createFrameControls();
});

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
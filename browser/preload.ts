import { remote } from 'electron';
import { accordionItem, accordionPanel } from './components/accordion/accordion.component';
import { tabItem } from './components/tab/tab.component';
const thisWindow = remote.getCurrentWindow();

// Define custom controls
customElements.define('acc-panel', accordionPanel);
customElements.define('acc-item', accordionItem);
customElements.define('tab-item', tabItem);

document.addEventListener('DOMContentLoaded', () => {
	// Load frame controls
	createFrameControls();
	updateMaxRestoreBtn();
});

function createFrameControls() {
	const windowControls = document.getElementById('Win_Controls');
	const windowLeftControl = document.getElementById('Left_FrameBtn');
	const windowCenterControl = document.getElementById('Center_FrameBtn');
	const windowRightControl = document.getElementById('Right_FrameBtn');

	windowLeftControl.addEventListener('click',() => {
		thisWindow.minimize();
	});
	windowCenterControl.addEventListener('click',() => {
		if (!thisWindow.isMaximized()) {
			thisWindow.maximize();
		} else {
			thisWindow.restore();
		}
		updateMaxRestoreBtn();
	});
	windowRightControl.addEventListener('click',() => {
		thisWindow.close();
	});

    if (window.navigator.userAgent.indexOf('Mac') !== -1) {
        windowControls.classList.add('mac');
    } else if (window.navigator.userAgent.indexOf('X11') !== -1 || window.navigator.userAgent.indexOf('Linux') !== -1) {
        windowControls.classList.add('lin');
    } else {
        windowControls.classList.add('win');
    }
}

function updateMaxRestoreBtn() {
	const windowCenterControl = document.getElementById('Center_FrameBtn');

	if (!thisWindow.isMaximized()) {
		windowCenterControl.className = 'Center_FrameBtn2';
	} else {
		windowCenterControl.className = 'Center_FrameBtn';
	}
}
const { remote } = require('electron');
const thisWindow = remote.getCurrentWindow();

module.exports.initUi = () => {
	createFrameControls();
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
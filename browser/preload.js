const { remote } = require('electron'),
	thisWindow = remote.getCurrentWindow();

document.addEventListener('DOMContentLoaded', function(){
	//Load frame controls
	const Window_Controls = document.getElementById('Win_Controls'),
		Window_Left_Control = document.getElementById('Left_FrameBtn'),
		Window_Center_Control = document.getElementById('Center_FrameBtn'),
		Window_Right_Control = document.getElementById('Right_FrameBtn');

	Window_Left_Control.addEventListener('click',() => {
		thisWindow.minimize();
	});
	Window_Center_Control.addEventListener('click',() => {
		if (!thisWindow.isMaximized()) { 
			Window_Center_Control.className = 'Center_FrameBtn2';	
			thisWindow.maximize(); 
		} else { 
			Window_Center_Control.className = 'Center_FrameBtn';
			thisWindow.restore(); 
		} 
	});
	Window_Right_Control.addEventListener('click',() => {
		thisWindow.close(); 
	});
    
	switch(! -1){
	case window.navigator.userAgent.indexOf('Mac'):
		Window_Controls.classList.add('mac');
		break;
	case window.navigator.userAgent.indexOf('X11'):
	case window.navigator.userAgent.indexOf('Linux'):
		Window_Controls.classList.add('lin');
		break;
	case window.navigator.userAgent.indexOf('Windows'):
	default:
		Window_Controls.classList.add('win');
	}
});
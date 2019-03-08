var {remote} = require('electron'),
	ThisWindow = remote.getCurrentWindow(),
	Window_Controls = document.getElementById('Win_Controls'),
	Window_Left_Control = document.getElementById('Left_FrameBtn'),
	Window_Center_Control = document.getElementById('Center_FrameBtn'),
	Window_Right_Control = document.getElementById('Right_FrameBtn');

Window_Left_Control.addEventListener('click',() => {
	ThisWindow.minimize();
});
Window_Center_Control.addEventListener('click',() => {
	if (!ThisWindow.isMaximized()) { 
		Window_Center_Control.className = 'Center_FrameBtn2';	
		ThisWindow.maximize(); 
	} else { 
		Window_Center_Control.className = 'Center_FrameBtn';
		ThisWindow.restore(); 
	} 
});
Window_Right_Control.addEventListener('click',() => {
	ThisWindow.close(); 
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

//==== Keybard Shortcuts ===============================================================================================//
document.onkeydown = function(e){
	if(e.ctrlKey && e.which == 84){
		//Ctrl + T
		OhHaiBrowser.tabs.add(OhHaiBrowser.settings.homepage(),undefined,{selected: true});
	}else if(e.ctrlKey && e.shiftKey && e.which == 78){
		//Ctrl + Shift + N
		OhHaiBrowser.tabs.add(OhHaiBrowser.settings.homepage(),undefined,{selected: true,mode:'incog'});
	}else if(e.ctrlKey && e.which == 68){
		//Ctrl + D
        
	}else if(e.ctrlKey && e.which == 72){
		//Ctrl + H
		OhHaiBrowser.tabs.add('history',undefined,{selected: true});
	}else if(e.ctrlKey && e.which == 70){
		//Ctrl + F

	}
};

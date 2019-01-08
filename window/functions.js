var {remote} = require('electron');
var ThisWindow = remote.getCurrentWindow();
var Window_Controls = document.getElementById("Win_Controls");

var WindowControls = {
	Left: function(){
		ThisWindow.minimize();
	},
	Center: function(){
		var ResizeBtn = document.getElementById("Center_FrameBtn");
		if (!ThisWindow.isMaximized()) { 
			//ResizeBtn.className = "";
			ResizeBtn.className = "Center_FrameBtn2";	
			ThisWindow.maximize(); 
		} else { 
			//ResizeBtn.className = "";
			ResizeBtn.className = "Center_FrameBtn";
			ThisWindow.restore(); 
		} 
	},
	Right: function(){
		ThisWindow.close(); 
	}
}


switch(! -1){
	case window.navigator.userAgent.indexOf("Mac"):
	Window_Controls.classList.add("mac");
	console.log("Mac");
	break;
	case window.navigator.userAgent.indexOf("X11"):
	case window.navigator.userAgent.indexOf("Linux"):
	Window_Controls.classList.add("lin");
	console.log("Linux");
	break;
	case window.navigator.userAgent.indexOf("Windows"):
	default:
	Window_Controls.classList.add("win");
	console.log("Windows");
}


ThisWindow.on("blur", function() {
	//alert("blur");
});

ThisWindow.on("focus", function() {
	//alert("focus");
});



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

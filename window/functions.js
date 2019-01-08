var {remote} = require('electron');
var ThisWindow = remote.getCurrentWindow();

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

ThisWindow.on("blur", function() {
	//alert("blur");
});

ThisWindow.on("focus", function() {
	//alert("focus");
});
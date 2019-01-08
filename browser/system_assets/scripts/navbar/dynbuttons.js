var URLBar = document.getElementById("URLBar");

var dynbtn1 = document.getElementById('Dyn1');
var dynbtn2 = document.getElementById('Dyn2');

var DynButtons =  {
	Check: function(){
		//Generic Check function that finds out if any dynamic buttons want to show up on this site
		DynButtons.CheckVideo();
	}
	CheckVideo: function(){
		var CurrentTab = tabs.getSelected();
		var CurrentWebView = document.getElementById(CurrentTab.getAttribute("href"));
		var str = CurrentWebView.getURL();
		if (str.includes("/watch?v=") == true){
		//Show youtube video button
			OhHaiBrowser.add_DynamicButton('popVideo','','Pop out video','');
		}
		else{
			OhHaiBrowser.remove_DynamicButton('popVideo');
		}
	}
}






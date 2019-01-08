
var Doodle = {
	DEPLOY: function(webview){
		//Webpage has finished loading so we now have full control...in theory
		var SiteType= Doodle.CHECK_URLTYPE(webview.getURL());
		
		if (SiteType != null){
			switch(SiteType.datatype){
				case "VIDEO":	
		//			Doodle.Notify(true,"I see you are watching a video, would you like to view it in a mini window?","OhHaiBrowser.ui.floatingVidPlayer('" + SiteType.responce + "');Doodle.Notify(false);");
					break;
				case "IMAGE":
		//			Doodle.Notify(true,"I see you are viewing an image, would you like to view it in an image viewer?","Doodle.Notify(false);");
					break;
			}
		}
		
	},
	CHECK_URLTYPE: function(URL){
        switch (true){
			case /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/.test(URL):	
				var video_id = URL.split('v=')[1];
				if(video_id > ""){
					var ampersandPosition = video_id.indexOf('&');
					if(ampersandPosition != -1) {
						video_id = video_id.substring(0, ampersandPosition);
					}
					return {datatype:"VIDEO",responce:"https://www.youtube.com/embed/" + video_id};
				}else{
					return null;
				}
				break;
            case /^https?:\/\/(?:[a-z\-]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:jpe?g|gif|png)$/.test(URL):
                //direct link to img, give the user the option to load this in a larger viewer
                return {datatype:"IMAGE",responce:URL};
                break;
            //case /^(https?:\/\/)?www\.([\da-z\.-]+)\.([a-z\.]{2,6})\/[\w \.-]+?\.pdf$.test(URL):
                //PDF file - give the user some sort of document menu?
            //    return "PDF";
            //    break;
            default:
                //Unable to find a site type
                return null;
                break;
        }
	},
	Notify: function(toggle,message,okfunc){
		if(toggle == true){
			$("#DoodleYesFunc").attr("onclick",okfunc);
			$("#DoodleMsg").text(message);
			$("#DoodlePopUp").fadeIn(300);
		}else{
			$("#DoodlePopUp").fadeOut(300);
		}
	},
	DropDown: function(){
		
	},
	CheckRegex(patern,testtxt){
		var patt = new RegExp(patern);
		return patt.test(testtxt);
	}
}
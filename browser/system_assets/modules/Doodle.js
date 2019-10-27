module.exports = {
	DEPLOY: function(webview){
		//Webpage has finished loading so we now have full control...in theory
		var SiteType= this.CHECK_URLTYPE(webview.getURL());
		
		if (SiteType != null){
			switch(SiteType.datatype){
			case 'VIDEO':	
				//this.Notify(true,"I see you are watching a video, would you like to view it in a mini window?","OhHaiBrowser.ui.floatingVidPlayer('" + SiteType.responce + "');this.Notify(false);");
				break;
			case 'IMAGE':
				//thiss.Notify(true,"I see you are viewing an image, would you like to view it in an image viewer?","this.Notify(false);");
				break;
			}
		}	
	},
	CHECK_URLTYPE: function(URL){
		switch (true){
		case /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/.test(URL):	
			var video_id = URL.split('v=')[1];
			if(video_id > ''){
				var ampersandPosition = video_id.indexOf('&');
				if(ampersandPosition != -1) {
					video_id = video_id.substring(0, ampersandPosition);
				}
				return {datatype:'VIDEO',responce:'https://www.youtube.com/embed/' + video_id};
			}else{
				return null;
			}
		case /^https?:\/\/(?:[a-z\-]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:jpe?g|gif|png)$/.test(URL):
			//direct link to img, give the user the option to load this in a larger viewer
			return {datatype:'IMAGE',responce:URL};
			//case /^(https?:\/\/)?www\.([\da-z\.-]+)\.([a-z\.]{2,6})\/[\w \.-]+?\.pdf$.test(URL):
			//PDF file - give the user some sort of document menu?
			//    return "PDF";
			//    break;
		default:
			//Unable to find a site type
			return null;
		}
	},
	Notify: function(toggle,message,okfunc){

		let template = OhHaiBrowser.core.generateElement(`
		<div id='DoodlePopUp' class='' style='display:none;'>
			<div class='speech-bubble-inner'>
				<img src='assets/imgs/doodle.png' />
				<span id='DoodleMsg'>${message}</span>
				<hr />
				<a href='#' id='DoodleYesFunc'>Yeah ok</a>
				<a href='#' onclick='Doodle.Notify(false);'>No thanks</a>
			</div>
		</div>
		`);

		template.querySelector('#DoodleYesFunc').addEventListener('click',() => {
			okfunc;
		});	

		if(toggle == true){
		//	$('#DoodlePopUp').fadeIn(300);
		}else{
		//	$('#DoodlePopUp').fadeOut(300);
		}
	},
	DropDown: function(){
		
	}
};
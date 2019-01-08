var OhHaiBrowserImported = {
	GetFavIcon: function(){
		var links = document.getElementsByTagName('link');
		for (var i=0; i<links.length; i++) {
			if (links[i].getAttribute('rel') == 'shortcut icon'){
				return links[i].getAttribute('href');
			}
			else if (links[i].getAttribute('rel') == 'icon'){
				
			}
			else{
				//we're shit out of luck buddy
				return "https://www.google.com/s2/favicons?domain=" + window.location.href
			}
		}
	}
}

document.addEventListener("DOMContentLoaded", function () {
	var data = {
		"title": document.title,
		"url": window.location.href,
		"favicon": OhHaiBrowserImported.GetFavIcon(),
		"links": document.getElementsByTagName('link'),
		"metas": document.getElementsByTagName('mata')
	};

	ipc.sendToHost("window-data", data);
});
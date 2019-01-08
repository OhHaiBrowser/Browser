
var quicklinks_0000000001 = {
	Load : function(){
		var FavList = document.createElement('ul');
		FavList.setAttribute('class','IconList');

		Quicklinks.List(function(FavItems){
			console.log("got array list");

			if(!Array.isArray(FavItems) || !FavItems.length){
				FavList.setAttribute('class','');

				var NoItems = document.createElement('li');
				NoItems.appendChild(document.createTextNode("No bookmarks :("));
			

				FavList.appendChild(NoItems);
			}else{
			for (var i = 0, len = FavItems.length; i < len; i++) {
				var QuickItem = document.createElement('li');
				var ThisItem = FavItems[i];

				var QlinkIcon = document.createElement('img');
				if(ThisItem.icon == ""){
					QlinkIcon.setAttribute("src","system_assets/Icons/favicon_default.png");
				}else{
					QlinkIcon.setAttribute("src",ThisItem.icon);
				}

				var QuickLink = document.createElement('a');
				QuickLink.appendChild(document.createTextNode(ThisItem.title));
				QuickLink.setAttribute("href","javascript:OhHaiBrowser.tabs.activePage.navigate('"+ThisItem.url+"');");

				QuickItem.appendChild(QlinkIcon);
				QuickItem.appendChild(QuickLink);
				//QuickItem.appendChild(document.createTextNode("- "+ ThisItem.datetime));

				FavList.appendChild(QuickItem);

				QuickLink.addEventListener('contextmenu', (e) => {
					e.preventDefault()

					var QlMen = OhHaiBrowser.ui.contextmenus.quicklink(ThisItem.id,ThisItem.title,ThisItem.url,QuickItem);
					QlMen.popup(remote.getCurrentWindow())
				}, false);
			}
			}

		});

		return FavList;
	}
}

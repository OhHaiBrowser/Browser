
var quicklinks_0000000001 = {
	Load : function(){

		let FavList = OhHaiBrowser.core.generateElement(`<ul class='IconList'></ul>`);

		Quicklinks.List(function(FavItems){
			if(!Array.isArray(FavItems) || !FavItems.length){
				FavList.appendChild(OhHaiBrowser.core.generateElement(`<li class='NoData'>No bookmarks :(</li>`));
			}else{
				for (var i = 0, len = FavItems.length; i < len; i++) {
					QuickItem = OhHaiBrowser.core.generateElement(`
						<li>
							<img src='${ThisItem.icon}'/>
							<a href='javascript:OhHaiBrowser.tabs.activePage.navigate(${ThisItem.url});'>${ThisItem.title}</a>
						</li>
					`);
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

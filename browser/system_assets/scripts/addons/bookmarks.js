module.exports = function load() {
	var {Quicklinks} = require('./../../modules/OhHaiBrowser.Data');

	let FavList = OhHaiBrowser.core.generateElement(`<ul></ul>`);

	Quicklinks.List(function (FavItems) {
		if (!Array.isArray(FavItems) || !FavItems.length) {
			FavList.appendChild(OhHaiBrowser.core.generateElement(`<li class='NoData'>No bookmarks :(</li>`));
		} else {
			FavItems.forEach((ThisItem) => {
				var QuickItem = OhHaiBrowser.core.generateElement(`
					<li class='bookmark'>
						<img src='${ThisItem.icon === '' ? 'system_assets/icons/favicon_default.png' : ThisItem.icon}'/>
						<a href='javascript:OhHaiBrowser.tabs.activePage.navigate("${ThisItem.url}");'>${ThisItem.title}</a>
					</li>
				`);
				FavList.appendChild(QuickItem);

				QuickItem.addEventListener('contextmenu', (e) => {
					e.preventDefault()
					var QlMen = OhHaiBrowser.ui.contextmenus.quicklink(ThisItem.id, ThisItem.title, ThisItem.url, QuickItem);
					QlMen.popup(remote.getCurrentWindow())
				}, false);
			});
		}
	});

	return FavList;
}
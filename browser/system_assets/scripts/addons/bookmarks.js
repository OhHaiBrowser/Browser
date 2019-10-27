var {remote} = require('electron');
var {Quicklinks} = require('./../../modules/OhHaiBrowser.Data');
var core = require('./../../modules/OhHaiBrowser.Core');

module.exports = function load() {

	let FavList = core.generateElement('<ul></ul>');

	Quicklinks.List(function (FavItems) {
		if (!Array.isArray(FavItems) || !FavItems.length) {
			FavList.appendChild(core.generateElement('<li class=\'NoData\'>No bookmarks :(</li>'));
		} else {
			FavItems.forEach((ThisItem) => {
				var QuickItem = core.generateElement(`
					<li class='bookmark'>
						<a href='javascript:OhHaiBrowser.tabs.activePage.navigate("${ThisItem.url}");'>
							<img src='${ThisItem.icon === '' ? 'assets/imgs/favicon_default.png' : ThisItem.icon}'/>
							<span>${ThisItem.title}</span>
						</a>
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
var {remote} = require('electron');
var {Quicklinks} = require('../../system_assets/modules/OhHaiBrowser.Data');
var core = require('../../system_assets/modules/OhHaiBrowser.Core');

module.exports = class FavoritesEl extends HTMLElement {
	constructor() {
		super();
		const shadowEl = this.attachShadow({mode: 'open'});
		shadowEl.innerHTML = '<ul id="Favlist"></ul>';

		this.updateData();
	}
	updateData() {
		let favlist = this.shadowRoot.getElementById('Favlist');
		Quicklinks.List().then((FavItems) => {
			if (!Array.isArray(FavItems) || !FavItems.length) {
				favlist.innerHTML = `
					<li class='NoData'>No bookmarks :(</li>
				`;
			} else {
				FavItems.forEach((ThisItem) => {
					favlist.innerHTML = '';
					var QuickItem = core.generateElement(`
					<li class='bookmark'>
						<a href='javascript:OhHaiBrowser.tabs.activePage.navigate("${ThisItem.url}");'>
							<img src='${ThisItem.icon === '' ? 'assets/imgs/favicon_default.png' : ThisItem.icon}'/>
							<span>${ThisItem.title}</span>
						</a>
					</li>
					`);
					favlist.appendChild(QuickItem);

					QuickItem.addEventListener('contextmenu', (e) => {
						e.preventDefault();
						var QlMen = OhHaiBrowser.ui.contextmenus.quicklink(ThisItem.id, ThisItem.title, ThisItem.url, QuickItem);
						QlMen.popup(remote.getCurrentWindow());
					}, false);
				});
			}
		});
	}
}

var {remote} = require('electron');
const {Menu, MenuItem} = remote;
var {Quicklinks} = require('../../system_assets/modules/OhHaiBrowser.Data');
var core = require('../../system_assets/modules/OhHaiBrowser.Core');
var {tabs} = require('../../services/tabs.service');

module.exports = class FavoritesEl extends HTMLElement {
	constructor() {
		super();
		const shadowEl = this.attachShadow({mode: 'open'});
		shadowEl.innerHTML = `
			<link rel="stylesheet" href="${__dirname}/bookmarks.css"/>
			<ul id="Favlist"></ul>
		`;

		this.addEventListener('dragenter', (e) => {

		});
		this.addEventListener('dragleave', (e) => {

		});
		this.addEventListener('dragover', (e) => { e.preventDefault(); });
		this.addEventListener('drop', (e) => {
			e.preventDefault();
			let data = event.dataTransfer.getData('Text');
		});

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
						var NewMenu = new Menu();
						NewMenu.append(new MenuItem({label: 'Open', click() { tabs.activePage.navigate(ThisItem.url); }}));
						NewMenu.append(new MenuItem({label: 'Open in new tab', click() { tabs.add(ThisItem.url, undefined, { selected: true });}}));
						NewMenu.append(new MenuItem({type: 'separator'}));
						NewMenu.append(new MenuItem({label: 'Delete', click() { Quicklinks.Remove(ThisItem.id).then(() => { QuickItem.parentNode.removeChild(QuickItem); }); }}));

						NewMenu.popup(remote.getCurrentWindow());
					}, false);
				});
			}
		});
	}
	add(url, title, icon, text, desc){
		Quicklinks.Add(url, title, icon, text, desc).then((resp) => {
			this.updateData();
		});
	}
	remove(id){
		Quicklinks.Remove(id).then((resp) => {
			this.updateData();
		});
	}
	isBookmarked(url, callback){
		Quicklinks.IsBookmarked(url).then((id) => {
			if (typeof callback === 'function') {
				callback(id);
			}
		}).catch(() => {
			if (typeof callback === 'function') {
				callback(null);
			}
		});
	}
};


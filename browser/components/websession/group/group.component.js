const { Sessions, Groups } = require('../../../system_assets/modules/OhHaiBrowser.Data'),
	{tabbar} = require('../../../services/tabbar.service'),
	{ remote } = require('electron'),
	{Menu,	MenuItem} = remote,
	CoreFunctions = require('../../../system_assets/modules/OhHaiBrowser.Core'),
	{tabs} = require('../../../services/tabs.service');
	
module.exports.Group = class {

	constructor(id, title) {
		this.id = id;
		this.Group = CoreFunctions.generateElement(`
			<li class='group' id='group_${id}'>
				<div class='ohhai-group-header'>
					<input type='text' class='ohhai-group-txt' value='${title != null ? title : 'New Group'}'/>
					<a class='ohhai-togglegroup'></a>
				</div>
				<ul class='ohhai-group-children'>
				</ul>
			</li>`);

		var GroupHead = this.Group.querySelector('.ohhai-group-header');
		var GroupName = this.Group.querySelector('.ohhai-group-txt');
		var ToggleGroup = this.Group.querySelector('.ohhai-togglegroup');
		var GroupChildren = this.Group.querySelector('.ohhai-group-children');
		ToggleGroup.addEventListener('click', () => {
			GroupChildren.classList.toggle('ClosedGroup');
		});
		GroupName.addEventListener('change', () => Groups.Upsert(id, GroupName.value));
		GroupHead.addEventListener('contextmenu', (e) => {
			e.preventDefault();
			var GroupMenu = this.contextMenu();
			GroupMenu.popup(remote.getCurrentWindow());
		}, false);
	}
	
	set title(value) {
		var GroupName = this.Group.querySelector('.ohhai-group-txt');
		GroupName.value = value;
	}	
	get title() {
		var GroupName = this.Group.querySelector('.ohhai-group-txt');
		return GroupName.value;
	}
	
	get children() {
		return this.Group.querySelector('.ohhai-group-children');
	}

	addTab(_tab) {
		var GroupChildren = this.Group.querySelector('.ohhai-group-children');
		GroupChildren.appendChild(_tab);

		var TabSessionId = _tab.getAttribute('data-session');
		Sessions.UpdateParent(TabSessionId, this.id);
		Sessions.UpdateMode(TabSessionId, 'grouped');
	}

	removeTab(_tab) {
		tabbar.tabcontainer.appendChild(_tab);

		var TabSessionId = _tab.getAttribute('data-session');
		Sessions.UpdateParent(TabSessionId, tabbar.tabcontainer.id);
		Sessions.UpdateMode(TabSessionId, 'default');

		if (this.children.length == 0) {
			var GroupParent = this.Group.parentElement;
			GroupParent.removeChild(this.Group);
		}
	}

	remove() {
		this.group.parentElement.removeChild(this.group);
	}

	contextMenu() {
		var GroupMenu = new Menu();
		GroupMenu.append(new MenuItem({
			label: 'Add tab to group',
			click() {
				tabs.add(window.OhHaiBrowser.settings.homepage, undefined, {
					selected: true,
					mode: 'grouped',
					parent: this.children
				});
			}
		}));
		GroupMenu.append(new MenuItem({
			type: 'separator'
		}));
		GroupMenu.append(new MenuItem({
			label: 'Remove group, keep tabs',
			click() {
				tabs.groups.remove(this.group, {
					keepChildren: true
				});
			}
		}));
		GroupMenu.append(new MenuItem({
			label: 'Remove group and tabs',
			click() {
				tabs.groups.remove(this.group, {
					keepChildren: false
				});
			}
		}));

		return GroupMenu;
	}

};
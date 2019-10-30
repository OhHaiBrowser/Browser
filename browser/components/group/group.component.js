const { Sessions, Groups } = require('../../system_assets/modules/OhHaiBrowser.Data'),
    Tabbar = require('../../system_assets/modules/OhHaiBrowser.Tabbar'),
    { remote } = require('electron'),
    CoreFunctions = require('../../system_assets/modules/OhHaiBrowser.Core');

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
		ToggleGroup.addEventListener('click', function (e) {
			GroupChildren.classList.toggle('ClosedGroup');
		});
		GroupName.addEventListener('change', () => Groups.Upsert(id, GroupName.value, (Retid) => {}));
		GroupHead.addEventListener('contextmenu', (e) => {
			e.preventDefault();
			var GroupMenu = OhHaiBrowser.ui.contextmenus.group(this.Group, GroupChildren);
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
		Sessions.UpdateParent(TabSessionId, this.id, function (id) {});
		Sessions.UpdateMode(TabSessionId, 'grouped', function (id) {});
	}

	removeTab(_tab) {
		Tabbar.tabcontainer.appendChild(_tab);

		var TabSessionId = _tab.getAttribute('data-session');
		Sessions.UpdateParent(TabSessionId, Tabbar.tabcontainer.id, function (id) {});
		Sessions.UpdateMode(TabSessionId, 'default', function (id) {});

		if (this.children.length == 0) {
			var GroupParent = this.Group.parentElement;
			GroupParent.removeChild(this.Group);
		}
	}

	remove(opts) {
		this.group.parentElement.removeChild(this.group);
	}

}
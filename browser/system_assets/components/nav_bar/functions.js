let {controls} = require('./system_assets/components/nav_bar/controls.js'),
	tabbar = require('./system_assets/modules/OhHaiBrowser.Tabbar.js'),
	AboutMenu = require('./system_assets/scripts/addons/about.js'),
	SettingsMenu = require('./system_assets/scripts/addons/settings.js'),
	UrlService = require('./system_assets/services/navbar.js'),
	Contextuals = require('./system_assets/modules/Contextuals/Contextuals.js');

controls.btn_ToggleTabBar.addEventListener('click', tabbar.toggle );
controls.btn_back.addEventListener('click', OhHaiBrowser.tabs.activePage.goBack );
controls.btn_refresh.addEventListener('click', OhHaiBrowser.tabs.activePage.reload );
controls.btn_forward.addEventListener('click', OhHaiBrowser.tabs.activePage.goForward );
//=========================================================================================================================
//Left Controls
//-------------------------------------------------------------------------------------------------------------------------
tabbar.panel.addEventListener('contextmenu', (e) => {
	switch (e.target.className) {
	case 'CommandBtn AddTab':
	case 'OhHai-TabMenu':
		//Everythig which isnt a tab
		var TbMen = OhHaiBrowser.ui.contextmenus.tabmenu();
		e.preventDefault();
		TbMen.popup(remote.getCurrentWindow());
		break;
	}
}, false);

function AddTabButton() {
	OhHaiBrowser.tabs.add(OhHaiBrowser.settings.homepage, undefined, {
		selected: true
	});
}

//--------------------------------------------------------------------------------------------------------------
//URL bar functions
controls.txt_urlbar.addEventListener('contextmenu', (e) => {
	e.preventDefault();
	var URlMenu = OhHaiBrowser.ui.contextmenus.urlbar(controls.txt_urlbar);
	URlMenu.popup(remote.getCurrentWindow());
}, false);

let urlbarValid = {};
controls.txt_urlbar.addEventListener('keydown', function (event) {
//Check validity of URL content
	UrlService(this.value, (resp) => {
		urlbarValid = resp;
	});
	//On Enter
	if (event.which == 13) {
		OhHaiBrowser.tabs.activePage.navigate(urlbarValid.output);
	}
});

//mouse event
controls.txt_urlbar.addEventListener('click', () => {
	if (controls.txt_urlbar.value != controls.txt_urlbar.getAttribute('data-text-swap')) {
		controls.txt_urlbar.value = controls.txt_urlbar.getAttribute('data-text-swap');
	}
});

controls.txt_urlbar.addEventListener('focus', () => {
	controls.div_urlOuter.classList.add('CenterFocus');
});

controls.txt_urlbar.addEventListener('focusout', () => {
	controls.txt_urlbar.value = controls.txt_urlbar.getAttribute('data-text-original');
	controls.div_urlOuter.classList.remove('CenterFocus');
});


//-----------------------------------------------------------------------------------------------------

controls.btn_bookmarked.addEventListener('click', function (e) {
	var popuplocation = {
		'left': e.currentTarget.offsetLeft,
		'top': e.currentTarget.offsetTop
	};
	if (controls.btn_bookmarked.classList.contains('QuicklinkInactive')) {
		//Add new bookmark
		controls.OhHaiBrowser.tabs.getCurrent(function (cTab) {
			var CurrentWebView = document.getElementById(cTab.getAttribute('data-container'));
			controls.OhHaiBrowser.bookmarks.add(CurrentWebView.getTitle(), CurrentWebView.getURL(), '', '', popuplocation, function (newqlink) {});
		});
	} else {
		//Remove bookmark
		var ThisId = Number(controls.btn_bookmarked.getAttribute('data-id'));
		Quicklinks.Remove(ThisId, function (e) {
			if (e != 0) {
				controls.btn_bookmarked.setAttribute('data-id', '');
				controls.btn_bookmarked.classList.remove('QuicklinkActive');
				controls.btn_bookmarked.classList.add('QuicklinkInactive');
			}
		});
	}
});

//Right Controls
//-------------------------------------------------------------------------------------------------------------------------
controls.btn_overflow.addEventListener('click',() => {
	new Contextuals.menu([
		{title:'New tab', tip:'', icon:'system_assets/icons/transparent.png', onclick:() => {
			OhHaiBrowser.tabs.add(OhHaiBrowser.settings.homepage,undefined,{selected: true});
		}},
		{title:'New incognito tab', tip:'', icon:'system_assets/icons/transparent.png', onclick:() => {
			OhHaiBrowser.tabs.add(OhHaiBrowser.settings.homepage,undefined,{selected: true,mode:'incog'});
		}},
		{seperator:true},
		{title:'Settings', tip:'', icon:'system_assets/icons/transparent.png', onclick:() => {
			OhHaiBrowser.ui.toggleModel(SettingsMenu(),'Settings');
		}},
		{title:'About', tip:'', icon:'system_assets/icons/transparent.png', onclick:() => {
			OhHaiBrowser.ui.toggleModel(AboutMenu(),'OhHai Browser');
		}}
	]);
});


function initAccordion(accordionElem) {
//when panel is clicked, handlePanelClick is called.          
	function handlePanelClick(event) {
		showPanel(event.currentTarget);
	}
	//Hide currentPanel and show new panel.  
	function showPanel(panel) {
		//Hide current one. First time it will be null. 
		var expandedPanel = accordionElem.querySelector('.acc_active');
		if (expandedPanel) {
			expandedPanel.classList.remove('acc_active');
		}
		//Show new one
		panel.classList.add('acc_active');
	}
	var allPanelElems = accordionElem.querySelectorAll('.acc_panel');
	for (var i = 0, len = allPanelElems.length; i < len; i++) {
		allPanelElems[i].addEventListener('click', handlePanelClick);
	}
	//By Default Show first panel
	showPanel(allPanelElems[0]);
}
initAccordion(document.getElementById('leftAccordion'));
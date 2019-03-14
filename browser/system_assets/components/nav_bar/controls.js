let validate = require('./../../modules/OhHaiBrowser.Validation');

let controls = {
	btn_ToggleTabBar: document.getElementById('HideShow'),
	lbl_TabCount: document.getElementById('HideShowCount'),
	btn_back: document.getElementById('Back'),
	lnk_cirtpip: document.getElementById('SecureCheck'),
	div_urlOuter: document.getElementById('URLBackColour'),
	txt_urlbar: document.getElementById('URLBar'),
	btn_bookmarked: document.getElementById('BtnQuicklink'),
	btn_refresh: document.getElementById('Refresh'),
	pan_urlAutoComplete: document.getElementById('URLAutoComplete'),
	btn_forward: document.getElementById('Forward'),
	btn_overflow: document.getElementById('Menu')
};
module.exports.controls = controls;

let functions = {
	updateTabCounter: function () {
		controls.lbl_TabCount.textContent = OhHaiBrowser.tabs.count;
	},
	updateURLBar: function (webview, callback) {
		if (!validate.internalpage(decodeURI(webview.getURL()))) {
			this.updatePageInfo(webview);
			controls.txt_urlbar.value = webview.getTitle();
			controls.txt_urlbar.setAttribute('data-text-swap', webview.getURL());
			controls.txt_urlbar.setAttribute('data-text-original', webview.getTitle());
		} else {
			controls.lnk_cirtpip.classList.remove('Http', 'Https', 'CirtError', 'Loading');
			controls.lnk_cirtpip.classList.add('Internal');
			controls.txt_urlbar.value = '';
			controls.txt_urlbar.setAttribute('data-text-swap', '');
			controls.txt_urlbar.setAttribute('data-text-original', '');
		}
		if (typeof callback == 'function') {
			callback(true);
		}
	},
	updatePageInfo: function (webview) {
		var webviewcontent = webview.getWebContents();
		var CurrentURL = decodeURI(webview.getURL());

		controls.lnk_cirtpip.classList.remove('Http', 'Https', 'CirtError', 'Loading', 'Internal');
		switch (true) {
		case CurrentURL.includes('http://'):
			controls.lnk_cirtpip.classList.add('Http');
			break;
		case CurrentURL.includes('https://'):
			controls.lnk_cirtpip.classList.add('Https');
			break;
		}

		webviewcontent.on('certificate-error', (e, url, error, cert) => {
			controls.lnk_cirtpip.classList.add('CirtError');
		});
	}
};
module.exports.functions = functions;
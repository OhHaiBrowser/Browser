class urlAutoComplete{
	constructor(url) {
		let searchProvider = window.OhHaiBrowser.settings.search;
		let urlbarValid = {};
		window.OhHaiBrowser.validate.url(url,function(isurl){ urlbarValid = isurl; });

		this.valid = urlbarValid.valid;
		this.output = this.valid ? urlbarValid.url : searchProvider + urlbarValid.url;
		this.type = this.valid ? 'url' : 'search';
		this.results = [];
	}
}
module.exports.AutoComplete = (value,callback) => { callback(new urlAutoComplete(value)); };

let controls = {
	btn_ToggleTabBar() { return document.getElementById('HideShow'); },
	lbl_TabCount() {return document.getElementById('HideShowCount');},
	btn_back() {return document.getElementById('Back');},
	txt_urlbar() {return document.getElementById('URLBar');},
	btn_forward() {return document.getElementById('Forward');},
	btn_overflow() {return document.getElementById('Menu');}
};
module.exports.controls = controls;

let functions = {
	updateTabCounter: function () {
		controls.lbl_TabCount().textContent = window.OhHaiBrowser.tabs.count;
	},
	/**
	 * 
	 * @param {Electron.WebviewTag} webview 
	 * @param {void} callback 
	 */
	updateURLBar: function (webview, callback) {
		const favList = document.getElementById('FavoritesList');
		controls.txt_urlbar().value = webview.getURL();
		this.updatePageInfo(webview);

		favList.isBookmarked(webview.getURL(), (id) => {
			controls.txt_urlbar().bookmarkId = id;
		});

		if (typeof callback == 'function') {
			callback(true);
		}
	},
	/**
	 * 
	 * @param {Electron.WebviewTag} webview 
	 */
	updatePageInfo: function (webview) {
		var webviewcontent = webview.getWebContents();
		webviewcontent.on('certificate-error', (e, url, error, cert) => {
			controls.txt_urlbar().updateCertBtn('error');
		});
	}
};
module.exports.functions = functions;
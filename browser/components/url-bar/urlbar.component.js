const {clipboard, remote} = require('electron');
const {Menu, MenuItem} = remote;
const url = require('url');
const PublicSuffixList = require('publicsuffixlist');
const validate = require('../../system_assets/modules/OhHaiBrowser.Validation');
const {tabs} = require('../../services/tabs.service');

var psl = new PublicSuffixList();
psl.initializeSync();

class UrlBar extends HTMLElement {
	constructor() {
		super();
		const shadowEl = this.attachShadow({mode: 'open'});
		shadowEl.innerHTML = `
			<link rel='stylesheet' href='${__dirname}/urlbar.component.css' />
			<div class="componentOuter">
				<div class="urlOuter">
					<a id="SecureCheck" class="DoubleURLBtn Internal"></a>
					<input class="URLBar" type="text" id="URLBar" />
					<button id="BtnQuicklink" class="URLButton"></button>
					<button id="Refresh" title="Refresh this page" class="URLButton Refresh"></button>             
				</div>
				<div id="URLAutoComplete" class="URL_AutoComplete AutoComplete_hidden"></div>
			</div>
        `;
		this.shadowRoot.getElementById('SecureCheck').addEventListener('click', () => {

		});
		let btnFav = this.shadowRoot.getElementById('BtnQuicklink');
		btnFav.addEventListener('click', () => {
			btnFav.classList.toggle('active');
			this.dispatchEvent(new CustomEvent('favorited', { detail: btnFav.classList.contains('active') }));
		});
		this.shadowRoot.getElementById('Refresh').addEventListener('click', () => {
			this.dispatchEvent(new CustomEvent('refresh'));
		});

		let txtUrlBar = this.shadowRoot.getElementById('URLBar');
		txtUrlBar.addEventListener('click', (e) => {
			if(txtUrlBar.value != txtUrlBar.getAttribute('data-text-swap')){
				txtUrlBar.value = txtUrlBar.getAttribute('data-text-swap');
				txtUrlBar.select();
			}
		});
		txtUrlBar.addEventListener('focusout', () => {
			this.shadowRoot.querySelector('.urlOuter').classList.remove('urlFocus');
			this.shadowRoot.getElementById('URLAutoComplete').classList.add('AutoComplete_hidden');
			txtUrlBar.value = txtUrlBar.getAttribute('data-text-original');
		});
		txtUrlBar.addEventListener('focus', () => {
			this.shadowRoot.querySelector('.urlOuter').classList.add('urlFocus');
		});
		txtUrlBar.addEventListener('keydown', (e) => {
			this.shadowRoot.getElementById('URLAutoComplete').classList.remove('AutoComplete_hidden');
			if(e.keyCode === 13) {
				const data = txtUrlBar.value;
				validate.url(data, (resp) => {
					if(resp.valid) {
						this.dispatchEvent(new CustomEvent('enter', { detail: resp.url}));
					}
				});
			}
		});

		var URlMenu = new Menu();
		URlMenu.append(new MenuItem({label: 'Copy title', click: () => { tabs.activePage.getTitle(Pt => clipboard.writeText(Pt)); }}));
		URlMenu.append(new MenuItem({label: 'Copy URL', click: () => { tabs.activePage.getURL(Purl => clipboard.writeText(Purl)); }}));
		URlMenu.append(new MenuItem({label: 'Paste', click: () => { this.value = clipboard.readText(); }}));

		txtUrlBar.addEventListener('contextmenu', (e) => {
			e.preventDefault();
			URlMenu.popup(remote.getCurrentWindow());
		}, false);
	}
	get value(){
		let txtUrlBar = this.shadowRoot.getElementById('URLBar');
		return txtUrlBar.getAttribute('data-text-swap');
	}
	set value(val){
		let txtUrlBar = this.shadowRoot.getElementById('URLBar');
		if(validate.internalpage(decodeURI(val))) {
			txtUrlBar.setAttribute('data-text-swap', '');
			txtUrlBar.value = '';
			txtUrlBar.setAttribute('data-text-original', '');
		} else {
			let checkURI = tld1(val);

			txtUrlBar.setAttribute('data-text-swap', checkURI.url);
	
			txtUrlBar.value = checkURI.tld1;
			txtUrlBar.setAttribute('data-text-original', checkURI.tld1);
		}

		this.updateCertBtn();
	}
	updateCertBtn(override = ''){
		let rawURL = this.shadowRoot.getElementById('URLBar').getAttribute('data-text-swap');
		let certBtn = this.shadowRoot.getElementById('SecureCheck');
		certBtn.classList.remove('Http', 'Https', 'CirtError', 'Loading', 'Internal');
		if(override != '') {
			certBtn.classList.add(override);
		} else{
			if (!validate.internalpage(decodeURI(rawURL))) {
				switch(true) {
				case rawURL.startsWith('https://'):
					certBtn.classList.add('Https');
					break;
				case rawURL.startsWith('http://'):
					certBtn.classList.add('Http');
					break;
				}
			} else {
				certBtn.classList.add('Internal');
			}
		}
	}
	get bookmarkId(){
		return this.shadowRoot.getElementById('BtnQuicklink').getAttribute('data-id');
	}
	set bookmarkId(val) {
		if (val === null || val === ''){
			this.shadowRoot.getElementById('BtnQuicklink').classList.remove('active');
		}else{
			this.shadowRoot.getElementById('BtnQuicklink').classList.add('active');
		}
		this.shadowRoot.getElementById('BtnQuicklink').setAttribute('data-id', val);
	}
}

module.exports.urlbar = UrlBar;

function tld1(uri) {
	uri = uri.startsWith('http://') || uri.startsWith('https://') ? uri : 'http://' + uri;
	let txtURL = url.parse(uri);
	let host = txtURL.host;
	if(validate.isIpAddress(host)){
		return {
			secure: (txtURL.protocol.toLowerCase() === 'https:') ? true : false,
			tld1: host,
			url: txtURL.href
		};
	} else {
		let dotSplit = psl.domain(host);
		return {
			secure: (txtURL.protocol.toLowerCase() === 'https:') ? true : false,
			tld1: dotSplit,
			url: txtURL.href
		};
	}
}
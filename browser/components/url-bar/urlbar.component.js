let validate = require('../../system_assets/modules/OhHaiBrowser.Validation');

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
			this.dispatchEvent(new Event('favorited', { detail: btnFav.classList.contains('active') }));
		});
		this.shadowRoot.getElementById('Refresh').addEventListener('click', () => {
			this.dispatchEvent(new Event('refresh'));
		});

		let txtUrlBar = this.shadowRoot.getElementById('URLBar');
		txtUrlBar.addEventListener('click', () => {
			if(txtUrlBar.value != txtUrlBar.getAttribute('data-text-swap')){
				txtUrlBar.value = txtUrlBar.getAttribute('data-text-swap');
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
				this.dispatchEvent(new Event('enter', { detail: txtUrlBar.value}));
			}
		});
	}
	setValues(friendly, raw) {
		let txtUrlBar = this.shadowRoot.getElementById('URLBar');
		txtUrlBar.value = friendly;
		txtUrlBar.setAttribute('data-text-swap', raw);
		txtUrlBar.setAttribute('data-text-original', friendly);
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
		if (val !== null || val !== ''){
			this.shadowRoot.getElementById('BtnQuicklink').classList.add('active');
		}else{
			this.shadowRoot.getElementById('BtnQuicklink').classList.remove('active');
		}
		this.shadowRoot.getElementById('BtnQuicklink').setAttribute('data-id', val);
	}
}

module.exports.urlbar = UrlBar;
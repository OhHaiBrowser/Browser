class UrlBar extends HTMLElement {
	constructor() {
		super();
		const shadowEl = this.attachShadow({mode: 'open'});
		shadowEl.innerHTML = `
			<link rel='stylesheet' href='${__dirname}/urlbar.component.css' />
			<div class="componentOuter">
				<div class="urlOuter">
					<a id="SecureCheck" class="DoubleURLBtn">&#xE72E;</a>
					<input class="URLBar" type="text" id="URLBar" />
					<button id="BtnQuicklink" class="URLButton">&#xE734;</button>
					<button id="Refresh" title="Refresh this page" class="URLButton Refresh">&#xE72C;</button>             
				</div>
				<div id="URLAutoComplete" class="URL_AutoComplete AutoComplete_hidden"></div>
			</div>
        `;
		this.shadowRoot.getElementById('SecureCheck').addEventListener('click', () => {

		});
		this.shadowRoot.getElementById('BtnQuicklink').addEventListener('click', () => {
			this.dispatchEvent(new Event('favorited', { detail: true }));
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
			this.shadowRoot.getElementById('URLAutoComplete').classList.add('AutoComplete_hidden');
			txtUrlBar.value = txtUrlBar.getAttribute('data-text-original');
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
	}
}

module.exports.UrlBar = UrlBar;
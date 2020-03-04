module.exports = class UrlBar extends HTMLElement {
	constructor() {
		super();
		const shadowEl = this.attachShadow({mode: 'open'});
		shadowEl.innerHTML = `
            <link rel='stylesheet' href='${__dirname}/urbar.component.css' />
            <div id="URLBackColour" class="CenterCenter">
                <a id="SecureCheck" class="DoubleURLBtn"></a>
                <input class="URLBar" type="text" id="URLBar" />
                <button id="BtnQuicklink" class="URLButton"></button>
                <button id="Refresh" title="Refresh this page" class="URLButton Refresh"></button>
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
		this.shadowRoot.getElementById('URLBar').addEventListener('click', () => {

		});
		this.shadowRoot.getElementById('URLBar').addEventListener('focusout', () => {

		});
		this.shadowRoot.getElementById('URLBar').addEventListener('keydown', (e) => {
			if(e.keyCode === 13) {
				this.dispatchEvent(new Event('enter', { detail: this.shadowRoot.getElementById('URLBar').value}));
			}
		});
	}
};

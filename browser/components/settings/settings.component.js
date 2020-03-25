const AboutMenu = require('../../system_assets/scripts/addons/about');
const SettingsMenu = require('../../system_assets/scripts/addons/settings');


module.exports = class SettingsEl extends HTMLElement{
	constructor(){
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${__dirname}/settings.component.css"/>           
            <div class="mainList">
                <input type="button" value="Settings" id="settings_btn"/>
                <input type="button" value="About" id="about_btn"/>
            </div>
        `;
		this.shadowRoot.getElementById('settings_btn').addEventListener('click', () => {
			window.OhHaiBrowser.ui.toggleModel(SettingsMenu(),'Settings');
		});
		this.shadowRoot.getElementById('about_btn').addEventListener('click', () => {
			window.OhHaiBrowser.ui.toggleModel(AboutMenu(),'OhHai Browser');
		});
	}
};

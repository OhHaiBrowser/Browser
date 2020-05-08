let core = require('../../system_assets/modules/OhHaiBrowser.Core');

module.exports = function load(){
	let aboutPage = core.generateElement(`
	<div class='SettingsList'>
		<p>Browser Version</p>
		<span>${window.OhHaiBrowser.version}</span>

		<p>Update Status</p>
		<span>Your browser is upto date :)</span>

		<p>Join the community</p>
		<a href='javascript:window.OhHaiBrowser.tabs.activePage.navigate("https://discord.gg/Q8QAdTs");'>Discord server</a>

	</div>`);



	return aboutPage;
};
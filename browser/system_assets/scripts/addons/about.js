let core = require('./../../modules/OhHaiBrowser.Core');

module.exports = function load(){
	let aboutPage = core.generateElement(`
	<div class='SettingsList'>
		<p>Browser Version</p>
		<span>3.3.0</span>

		<p>Update Status</p>
		<span>Your browser is upto date :)</span>
	</div>`);

	return aboutPage;
};